import db from '@shared/db';
import { Composer } from 'grammy';
import menuView from '@menus/modules/shared/sendout/view/message/view';
import { ServerManager } from "src/common/services/ServerManager";
import type { MyContext } from '@shared/types/SessionData';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^removeMessage:/, async (ctx: MyContext) => {
    const message = await db.message.getById(Number(ctx.callbackQuery?.data?.split(':')[1]!.split('#')[1]));

    await db.message.remove(message?.id!);
    const server = new ServerManager();
    const menu = menuView.removeMessage(ctx, await server.restartProcessOrNot(ctx.session.sendout.name!, true));

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

messageComposer.callbackQuery(/^paginationMessages:/, async (ctx: MyContext) => {
    const messages = await db.message.getMessages(ctx.session.sendout.id!);
    const menu = menuView.pagination(ctx, messages?.length!);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default messageComposer;