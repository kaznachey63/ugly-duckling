import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import menuMedia from '@menus/commands/cabinet/distribution/message/media';
import { ServerManager } from '@utils/ServerManager';
import { Composer, GrammyError, InlineKeyboard } from 'grammy';

const mediaComposer = new Composer<MyContext>();

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
mediaComposer.callbackQuery(/^addMedia/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const positionId = Number(queryData!.split(/#/)[1]);

    ctx.session.state.media.adding = true;
    ctx.session.state.media.positionId = positionId;

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
    const positionId = Number(queryData!.split(/#/)[1]);
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const message = messages[positionId];
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

export default mediaComposer;