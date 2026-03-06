import db from '@shared/db';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import type { MyContext } from '@shared/types/SessionData';
import { randomUUID } from "crypto";
import consts from '@constants';
import utils from '@utils';
import type { Message } from 'grammy/types';
import menuMedia from '@menus/commands/cabinet/distribution/message/media';
import { ServerManager } from '@utils/ServerManager';
import { Composer, GrammyError, InlineKeyboard } from 'grammy';

const mediaComposer = new Composer<MyContext>();

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
mediaComposer.callbackQuery(/^addMedia/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;

    ctx.session.state.media.adding = true;
    ctx.session.state.media.paginationId = positionIndex;

    const menu = menuMedia.add(ctx);
    let msg: any;
    try {
        // Сохранение айди для последующего редактирования этого же сообщения
        msg = await ctx.editMessageText(menu.text, { 
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        // 🎯 Перехватываем именно эту ошибку Telegram
        if (error instanceof GrammyError && error.description?.includes("message is not modified")) {
            return;
        }
        throw error;
    }

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.idForUpdateMessageFromState = msg.message_id;
    }
});

/**
 * Оповещение пользователя об удалении всех медиа
 */
mediaComposer.callbackQuery(/^clearAllMedia/, async (ctx: MyContext) => {    
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const message = messages[positionIndex];
    const server = new ServerManager();

    // 🔥 УДАЛЯЕМ ФАЙЛЫ ИЗ ФАЙЛОВОЙ СИСТЕМЫ
    for (const file of message?.media!) {
        if (file && file !== 'null' && typeof file === 'string') {
            try {
                await utils.file.deleteFile(file);
                console.log(`🗑️ Удалён файл: ${file}`);
            } catch (err) {
                console.warn(`Файл не найден: ${file}`);
            }
        }
    }
    
    // 🔥 ОБНУЛЯЕМ МЕДИА В БД
    await db.message.updateMessage(nameDistribution, message?.id!, { media: null });
    
    const menu = menuMedia.clearAll(ctx, await server.restartProcessOrNot(nameDistribution));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

mediaComposer.callbackQuery("parametersMedia", async (ctx: MyContext) => { 
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.media.parameters.alert"), show_alert: true });
});

type MediaType = 'photo' | 'video' | 'animation' | 'document' | 'unknown';
interface MediaValidationData {
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    file_id?: string;
    fileName?: string;
}

/**
 * Состояние пользователя: добавление медиа
 */
mediaComposer.callbackQuery(/^addingMedia/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name;
    const msg = ctx.message;
    if (!msg) return;

    const mediaType = determineMediaType(msg);

    switch (mediaType) {
        case 'document': {
            if (!isDocumentAllowed(msg)) {
                utils.common.resetSessionStates(ctx.session);
                await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState,
                    utils.formatting.escapeMarkdown(ctx.t("commands.cabinet.distribution.messages.media.adding.documentsWTMedia")), {
                    reply_markup: new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${nameDistribution}`),
                    parse_mode: "MarkdownV2"
                });
                return;
            }
            break;
        }
        case 'unknown': {
            utils.common.resetSessionStates(ctx.session);
            await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState,
                utils.formatting.escapeMarkdown(ctx.t("commands.cabinet.distribution.messages.media.adding.invalidType")), {
                reply_markup: new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${nameDistribution}`),
                parse_mode: "MarkdownV2"
            });
            return;
        }
    }

    // Валидация (размер + mime)
    const mediaData = extractMediaData(msg, mediaType);
    if (!mediaData || !validateMedia(mediaData)) {
        utils.common.resetSessionStates(ctx.session);
        await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState,
            utils.formatting.escapeMarkdown(ctx.t("commands.cabinet.distribution.messages.media.adding.bigSize")), {
            reply_markup: new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${nameDistribution}`),
            parse_mode: "MarkdownV2"
        });
        return;
    }

    const { file_id, fileName } = mediaData;
    if (!fileName || !file_id) return;

    const pathMedia = path.resolve("..", "sendout", "resources");
    const nameFile = generateFileName(fileName!, mediaType);

    try {
        const file = await ctx.api.getFile(file_id);
        const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.mkdir(pathMedia, { recursive: true });
        await fs.writeFile(path.join(pathMedia, nameFile), buffer);

        // Получение сообщений
        const messages = await db.message.getMessagesForBot(nameDistribution);
        if (!messages) return;

        const message = messages[ctx.session.state.media.paginationId!];
        if (!message) {
            utils.common.resetSessionStates(ctx.session);
            await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState, 
                utils.formatting.escapeMarkdown(ctx.t("commands.cabinet.distribution.messages.media.adding.error")), {
                reply_markup: new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${nameDistribution}`),
                parse_mode: "MarkdownV2"
            });
            return;
        }

        const existingMedia = message.media || [];
        const newMedia = [...existingMedia, nameFile];

        // Обновление медиа
        await db.message.updateMessage(nameDistribution, message.id, { media: newMedia });
        await utils.common.sleep(250);
        const server = new ServerManager();
        const menu = menuMedia.adding(ctx, await server.restartProcessOrNot(nameDistribution));
        
        utils.common.resetSessionStates(ctx.session);
        await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState, menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        console.error("Ошибка при сохранении медиа:", error);
        utils.common.resetSessionStates(ctx.session);
        await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState,
            utils.formatting.escapeMarkdown(ctx.t("commands.cabinet.distribution.messages.media.adding.error")), {
            reply_markup: new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${nameDistribution}`),
            parse_mode: "MarkdownV2"
        });
    }
})

// Определение типа медиа
function determineMediaType(msg: Message): MediaType {
    if ('photo' in msg && msg.photo?.length) return 'photo';
    else if ('video' in msg && msg.video) return 'video';
    else if ('animation' in msg && msg.animation) return 'animation';
    else if ('document' in msg && msg.document) return 'document';
    else return 'unknown';
}

// Документы содержат: фото/видео/гиф
function isDocumentAllowed(msg: Message): boolean {
    const mimeType = msg.document?.mime_type;
    if (!mimeType) return false;
    return utils.local.isSupportedMediaType(mimeType);
}

// Валидация: размер + mime
function validateMedia(mediaData: MediaValidationData): boolean {
    // Проверка размера
    if (mediaData.fileSize && mediaData.fileSize > consts.maxSizeFile) {
        return false;
    }

    // Чек mime
    if (mediaData.mimeType && !utils.local.isSupportedMediaType(mediaData.mimeType)) return false;

    return true;
}

// Получение данных о медиа
function extractMediaData(msg: Message, type: MediaType): MediaValidationData | null {
    switch (type) {
        case 'photo': {
            const photo = msg.photo![msg.photo!.length - 1]!;
            return {
                file_id: photo.file_id,
                fileSize: photo.file_size,
                fileName: `photo_${photo.file_id}.jpg`
            };
        }
        case 'video': {
            return {
                file_id: msg.video!.file_id,
                fileSize: msg.video!.file_size,
                fileName: msg.video!.file_name || `video_${msg.video!.file_id}.mp4`,
                mimeType: msg.video!.mime_type
            };
        }
        case 'animation': {
            return {
                file_id: msg.animation!.file_id,
                fileSize: msg.animation!.file_size,
                fileName: msg.animation!.file_name || `anim_${msg.animation!.file_id}.gif`,
                mimeType: msg.animation!.mime_type
            };
        }
        case 'document': {
            return {
                file_id: msg.document!.file_id,
                fileSize: msg.document!.file_size,
                fileName: msg.document!.file_name || `doc_${msg.document!.file_id}`,
                mimeType: msg.document!.mime_type
            };
        }
        default: {
            return null;
        }
    }
}

// Построение имени файла
function generateFileName(originalName: string, type: MediaType): string {
    const prefix = randomUUID().substring(0, 9);
    const ext = path.extname(originalName) ||
        utils.local.getMediaFormat(
            type === 'photo' ? 'image/jpeg' :
                type === 'video' ? 'video/mp4' :
                    type === 'animation' ? 'video/gif' : 'application/octet-stream',
            path.extname(originalName)
        );
    return `${prefix}${ext.startsWith('.') ? ext : '.' + ext}`;
}

export default mediaComposer;