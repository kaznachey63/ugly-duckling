import db from '@shared/db';
import { Composer } from 'grammy';
import menuView from '@menus/modules/cabinet/distribution/message/view';
import { ServerManager } from "src/common/services/ServerManager";
import type { MyContext } from '@shared/types/SessionData';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^removeMessage:/, async (ctx: MyContext) => {
    const positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    ctx.session.other.text.positionId = positionId;
    const messages = await db.message.getMessagesForBot(ctx.session.distribution.schema);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.removeMessage(ctx.session.distribution.schema, messageId);
    const server = new ServerManager();
    const menu = menuView.removeMessage(ctx, await server.restartProcessOrNot(ctx.session.distribution.name, true));

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

messageComposer.callbackQuery(/^paginationMessages:/, async (ctx: MyContext) => {
    const messages = await db.message.getMessagesForBot(ctx.session.distribution.schema);
    const menu = menuView.pagination(ctx, messages?.length!);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default messageComposer;