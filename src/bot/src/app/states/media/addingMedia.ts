import db from '@shared/db';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import type { MyContext } from '@shared/types/SessionData';
import { randomUUID } from "crypto";
import consts from 'src/common/constants';
import utils from 'src/common/utils';
import type { Message } from 'grammy/types';
import menuMedia from '@menus/states/media';
import { ServerManager } from '@utils/ServerManager';
import type { Status } from '@shared/types/server/Status';

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
export default async function addingMedia(ctx: MyContext) {
    const msg = ctx.message;
    if (!msg) return;

    const mediaType = determineMediaType(msg);

    switch (mediaType) {
        case 'document': {
            if (!isDocumentAllowed(msg)) {
                await ctx.reply(ctx.t("states.media.add.documentsWTMedia"));
                return;
            }
            break;
        }
        case 'unknown': {
            await ctx.reply(ctx.t("states.media.add.invalidType"));
            return;
        }
    }

    // Валидация (размер + mime)
    const mediaData = extractMediaData(msg, mediaType);
    if (!mediaData || !validateMedia(mediaData)) {
        await ctx.reply(ctx.t("states.media.add.bigSize", { size: consts.maxSizeFile }));
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
        const messages = await db.message.getMessagesForBot(ctx.session.distribution.name);
        if (!messages) return;

        const message = messages[ctx.session.typePartition.media.id!];
        if (!message) {
            await ctx.reply(ctx.t("states.media.add.error"));
            return;
        }

        const existingMedia = message.media || [];
        const newMedia = [...existingMedia, nameFile];

        // Обновление медиа
        await db.message.updateMessage(ctx.session.distribution.name, message.id, { media: newMedia });
        utils.common.sleep(250);
        const server = new ServerManager();
        const menu = menuMedia.add(ctx, await server.execute("status", ctx.session.distribution.name) as Status);
        
        // await ctx.deleteMessage(ctx.message.message_id);

        try {
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: "MarkdownV2"
            });
        } catch {
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: "MarkdownV2"
            });
        }    
    } catch (error) {
        console.error("Ошибка при сохранении медиа:", error);
        await ctx.reply(ctx.t("states.media.add.error"));
    }
}

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