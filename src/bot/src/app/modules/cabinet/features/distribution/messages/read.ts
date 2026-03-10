import db from '@shared/db';
import { Composer, GrammyError } from 'grammy';
import menuRead from '@menus/commands/cabinet/distribution/message/read';
import { ServerManager } from "@utils/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';

const readMessageComposer = new Composer<MyContext>();

readMessageComposer.callbackQuery(/^removeMessage:/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    const positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    ctx.session.state.text.positionId = positionId;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.removeMessage(nameDistribution, messageId);
    const server = new ServerManager();
    const menu = menuRead.removeMessage(ctx, await server.restartProcessOrNot(nameDistribution, true));

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

readMessageComposer.callbackQuery(/^updateText:/, async (ctx: MyContext) => {
    ctx.session.state.text.updating = true;
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    const menu = menuRead.updateText(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

readMessageComposer.callbackQuery(/^paginationMessages:/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const dataPages = queryData!.split(/#/)[1];
    const [nowPage, allPage] = (dataPages?.split('/'))?.map(Number)!;

    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.pagination", { nowPage: nowPage, allPage: allPage }), show_alert: true });
});

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
readMessageComposer.callbackQuery(/^addMedia/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const positionId = Number(queryData!.split(/#/)[1]);

    ctx.session.state.media.adding = true;
    ctx.session.state.media.positionId = positionId;

    const menu = menuRead.addMedia(ctx);
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
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

/**
 * Оповещение пользователя об удалении всех медиа
 */
readMessageComposer.callbackQuery(/^clearAllMedia:/, async (ctx: MyContext) => {    
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    const positionId = Number(queryData!.split(/#/)[1]);
    ctx.session.state.media.positionId = positionId;
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
    
    const menu = menuRead.clearAllMedia(ctx, await server.restartProcessOrNot(nameDistribution, true));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default readMessageComposer;