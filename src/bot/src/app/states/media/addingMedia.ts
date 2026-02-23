import db from '@shared/db';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import type { MyContext, SessionData } from '@shared/types/SessionData';
import { randomUUID } from "crypto";
import consts from 'src/common/constants';
import utils from 'src/common/utils';

export default async function addingMedia(ctx: MyContext) {
    const msg = ctx.message;

    if (!ctx || !msg || !('photo' in msg || 'video' in msg || 'animation' in msg || 'document' in msg)) return;

    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = ctx.session.typePartition.media.id!;
    const pathMedia = path.join("..", "sendout", "resources");
    const result = await getTypeMedia(ctx);
    if (!result) return; // ошибка уже показана

    const [nameFile, whichMedia] = result;
    
    try {
        const fileLink = await ctx.telegram.getFileLink(whichMedia.file_id);
        const response = await fetch(fileLink.href);

        if (!await validateMedia(ctx, response)) return;

        const arrayBuffer = await response.arrayBuffer();
        await fs.mkdir(pathMedia!, { recursive: true });
        await utils.file.saveFile(Buffer.from(arrayBuffer), nameFile)
        
        // Обновляем JSON
        // ✅ НОВЫЙ КОД
        const messages = await db.message.getMessagesForBot(nameDistribution);
        if (!messages) return;

        const message = messages[positionIndex];
        if (!message) {
            await ctx.reply("Ошибка при сохранении медиа");
            return;
        }

        const existingMedia = message.media || [];
        console.log(existingMedia);
        const newMedia = [...existingMedia, nameFile];
        console.log(newMedia);

        await db.message.updateMessage(nameDistribution, message.id, { media: newMedia });

        // ✅ Отправляем уведомление ТОЛЬКО ОДИН РАЗ для группы
        if (msg.media_group_id) {
            isMediaGroup(ctx);
        }
        await sendConfirmation(ctx);
    } catch (error) {
        console.error("Ошибка при сохранении медиа:", error);
        await ctx.reply("Ошибка при сохранении медиа.");
    }
}

async function getTypeMedia(ctx: MyContext): Promise<[string, any] | void> {
    const msg = ctx.message!;

    let whichMedia: any;
    let nameFile = randomUUID().toString();

    if ('photo' in msg && msg.photo) {
        whichMedia = msg.photo.pop();
        nameFile += '.jpg';

    } else if ('video' in msg && msg.video) {
        whichMedia = msg.video;
        const mimeType = msg.video.mime_type;
        const ext = msg.video.file_name?.split('.').pop();
        nameFile += utils.local.getMediaFormat(mimeType ?? 'video/mp4', ext ?? '');

    } else if ('animation' in msg && msg.animation) {
        whichMedia = msg.animation;
        const mimeType = msg.animation.mime_type;
        const ext = msg.animation.file_name?.split('.').pop();
        nameFile += utils.local.getMediaFormat(mimeType ?? 'video/mp4', ext ?? '');

    } else if ('document' in msg && msg.document) {
        const mimeType = msg.document.mime_type;
        if (!mimeType || !utils.local.isSupportedMediaType(mimeType)) {
            await ctx.reply("Я не умею обрабатывать документы, не содержащие медиа");
            return; // ← выход без возврата
        }
        whichMedia = msg.document;
        const ext = msg.document.file_name?.split('.').pop();
        nameFile += utils.local.getMediaFormat(mimeType, ext ?? '');

    } else {
        await ctx.reply("Тип медиа не опознан! Попробуйте снова");
        return;
    }

    return [nameFile, whichMedia];
}

async function validateMedia(ctx: MyContext, response: any): Promise<boolean> {
    const contentType = response.headers.get('content-type');

    if (!contentType || utils.local.isSupportedMediaType(contentType)) {
        await ctx.reply("Некорректный тип медиа. Попробуйте снова");
        return false;
    }

    const contentLength = Number(response.headers.get('content-length'));
    if (contentLength && contentLength > consts.maxSizeFile) {
        await ctx.reply("Файл слишком большой. Максимальный размер 3 МБ.");
        return false;
    }

    return true;
}

function isMediaGroup(ctx: MyContext) {
    ctx.session.mediaBuffer.items++;

    if (ctx.session.mediaBuffer.timer) {
        clearTimeout(ctx.session.mediaBuffer.timer);
    }

    ctx.session.mediaBuffer.timer = setTimeout(async () => {
        try {
            await sendConfirmation(ctx);
            ctx.session.mediaBuffer.timer = null;
            ctx.session.mediaBuffer.items = 0;
        } catch (error) {
            console.error("Ошибка при отправке подтверждения:", error);
            // Опционально: сбросить состояние
            ctx.session.mediaBuffer.timer = null;
            ctx.session.mediaBuffer.items = 0;
        }
    }, 500);
    return;
}

async function sendConfirmation(ctx: MyContext) {
    if (!ctx.message) return;
    const menuAddingMedia = Markup.inlineKeyboard([
        Markup.button.callback("🔙 Назад", "mainMessage" + ctx.session.distribution.name!)
    ]);

    try {
        const success = await utils.server.reloadService(ctx.session.distribution.name);
        let textMessage = success
            ? "✅ Медиа сохранено!"
            : "❌ Медиа не сохранено!\nОбратитесь к администратору"
        ;
        textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Добавление медиа*]`;

        if (ctx?.message.message_id - 1) {
            try {
                await ctx.deleteMessage(ctx?.message.message_id - 1);
            } catch (error) {
                console.warn(error);
            }
        }

        try {
            await ctx.telegram.editMessageText(
                ctx.chat?.id!,
                ctx.session.messageIds.forTextOrMedia,
                undefined,
                utils.formatting.escapeMarkdown(textMessage),
                { parse_mode: "MarkdownV2", reply_markup: menuAddingMedia.reply_markup }
            );
        } catch {
            await ctx.reply(utils.formatting.escapeMarkdown(textMessage), {
                parse_mode: "MarkdownV2",
                ...menuAddingMedia
            });        }
    } catch (error) {
        console.error("sendConfirmation failed:", error);
    }
}