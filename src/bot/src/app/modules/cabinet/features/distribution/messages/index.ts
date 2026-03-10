import db from '@shared/db';
import common from "@utils/common";
import type { MyContext } from '@shared/types/SessionData';
import menuMessage from '@menus/commands/cabinet/distribution/message/main';
import { ServerManager } from "@utils/ServerManager";
import { Composer } from 'grammy';
import readMessageComposer from './read';
import addMessageComposer from './add';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^mainMessage:/, async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const nameDistribution = ctx.session.distribution.name!;
    
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    
    ctx.session.state.text.positionId = messages.length;
    const menu = menuMessage.main(ctx, messages);
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

messageComposer.callbackQuery(/^mainAddText:/, async (ctx: MyContext) => {
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);

    const menu = menuMessage.add(ctx);
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

messageComposer.callbackQuery(/^clearAllMessages:/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;

    await db.message.removeAllMessage(nameDistribution);
    const server = new ServerManager();
    const menu = menuMessage.clearAll(ctx, await server.restartProcessOrNot(nameDistribution, true));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

messageComposer.callbackQuery(/^readMessage:/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);    

    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const menu = menuMessage.read(ctx, messages);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

messageComposer.use(readMessageComposer);
messageComposer.use(addMessageComposer);

export default messageComposer;