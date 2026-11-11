import db from '@shared/db';
import path from 'path';
import fetch from 'node-fetch';
import type { MyContext } from '@shared/types/SessionData';
import { randomUUID } from "crypto";
import consts from '@common/constants';
import utils from '@utils';
import type { Message } from 'grammy/types';
import menuAddingMedia from '@menus/handlers/states/addingMedia';
import { ServerManager } from '@common/services/ServerManager';
import { sleep } from 'telegram/Helpers';
import { FileService } from '@common/services/FileService';
import type { Media } from '@shared/types/DataBase';

interface MediaValidationData {
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    file_id?: string;
    fileName?: string;
}

type MediaType = 'photo' | 'video' | 'animation' | 'document' | 'unknown';

/**
 * Состояние пользователя: добавление медиа
 */
export default async function addingMedia(ctx: MyContext) {
    const sendoutId = ctx.session.sendout!.id!;
    const msg = ctx.message;

    if (!msg) return;
    const mediaType = determineMediaType(msg);

    // 1. Проверка типа и валидация (без сброса сессии!)
    switch (mediaType) {
        case 'document': {
            if (!isDocumentAllowed(msg)) {
                await editMessage(ctx, false);
                return;
            }
            break;
        }
        case 'unknown': {
            await editMessage(ctx, false);
            return;
        }
    }

    const mediaData = extractMediaData(msg, mediaType);
    if (!mediaData || !validateMedia(mediaData)) {
        await editMessage(ctx, false);
        return;
    }

    const { file_id, fileName } = mediaData;
    if (!fileName || !file_id) return;

    const pathMedia = path.resolve('src', "sendout", "resources");
    
    const nameFile = generateFileName(fileName!, mediaType);

    try {
        // 2. Скачивание файла
        const file = await ctx.api.getFile(file_id);
        const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        
        const fileService = new FileService();
        await fileService.createDir(pathMedia);
        await fileService.writeBuffer(path.join(pathMedia, nameFile), buffer);
        
        // 3. ✅ БЕРЕМ СООБЩЕНИЕ НАПРЯМУЮ ИЗ СЕССИИ (никаких лишних запросов и поисков по индексу)
        const message = ctx.session.message;
        if (!message || !message.id) {
            console.error("Ошибка: Сообщение не найдено в сессии");
            utils.common.resetSessionStates(ctx.session);
            await editMessage(ctx, false); 
            return;
        }

        // 4. Добавление медиа
        const media: Media = {
            message_id: message.id,
            name: nameFile!
        };
        
        // ✅ Безопасная инициализация массива (спасает от краша при первом медиа)
        if (!message.media) {
            message.media = [];
        }

        message.media.push({ 
            message_id: message.id ?? null, 
            name: nameFile ?? null,
            id: 0,
            position: null 
        });

        // Обновляем сессию, чтобы в меню отобразился новый счетчик (1/4, 2/4...)
        ctx.session.message = message;

        // Сохраняем связку в БД
        await db.media.add(media);

        // 5. Финал
        await sleep(250);
        await editMessage(ctx, true, await ServerManager.restartProcessOrNot(ctx.session.sendout?.name!, true));
        
        // Сбрасываем состояние ТОЛЬКО после успешного добавления
        utils.common.resetSessionStates(ctx.session);
    } catch (error) {
        console.error("Ошибка при сохранении медиа:", error);
        utils.common.resetSessionStates(ctx.session);
        await editMessage(ctx, false);
    }
};

// Редактирование сообщения
async function editMessage(ctx: MyContext, validate: boolean, result?: boolean) {
    const res = result ? result : false;
    const menu = menuAddingMedia(ctx, validate, res);

    try {
        await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState,
            menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        // ✅ Игнорируем ошибку, если текст сообщения не изменился (спасает от зависания при спаме)
        if (!(error instanceof Error && error.message.includes('message is not modified'))) {
            console.error("Ошибка при редактировании сообщения:", error);
        }
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
    if (mediaData.fileSize && mediaData.fileSize > consts.media.maxSizeFile) {
        return false;
    }
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