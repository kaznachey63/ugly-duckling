import db from '@shared/db';
import { Composer, GrammyError } from 'grammy';
import menuView from '@menus/modules/commands/cabinet/sendout/message/view';
import { ServerManager } from "src/common/services/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import { FileService } from 'src/common/services/FileService';

const mediaComposer = new Composer<MyContext>();

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
mediaComposer.callbackQuery(/^addMedia/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const positionId = Number(queryData!.split(/#/)[1]);

    ctx.session.state.addingMedia = true;
    ctx.session.other.media.positionId = positionId;

    const menu = menuView.addMedia(ctx);
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
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

/**
 * Оповещение пользователя об удалении всех медиа
 */
mediaComposer.callbackQuery(/^clearAllMedia:/, async (ctx: MyContext) => {    
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.sendout.name!;
    const positionId = Number(queryData!.split(/#/)[1]);
    ctx.session.other.media.positionId = positionId;
    const messages = await db.message.getMessagesForBot(ctx.session.sendout.schema);
    if (!messages) return;
    const message = messages[positionId];
    const server = new ServerManager();

    // 🔥 УДАЛЯЕМ ФАЙЛЫ ИЗ ФАЙЛОВОЙ СИСТЕМЫ
    for (const file of message?.media!) {
        if (file && file !== 'null' && typeof file === 'string') {
            try {
                const fileService = new FileService();
                await fileService.deleteFile(file);
                console.log(`🗑️ Удалён файл: ${file}`);
            } catch (err) {
                console.warn(`Файл не найден: ${file}`);
            }
        }
    }
    
    // 🔥 ОБНУЛЯЕМ МЕДИА В БД
    await db.message.updateMessage(ctx.session.sendout.schema, message!.id!, { media: null });
    
    const menu = menuView.clearAllMedia(ctx, await server.restartProcessOrNot(nameDistribution, true));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default mediaComposer;