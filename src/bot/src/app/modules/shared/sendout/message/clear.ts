import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuClear from '@menus/modules/shared/sendout/message/clear';
import { ServerManager } from "src/common/services/ServerManager";
import { Composer } from 'grammy';

const clearComposer = new Composer<MyContext>();

clearComposer.callbackQuery(/^clearMessages:/, async (ctx: MyContext) => {
    const messages = await db.message.getMessages(ctx.session.sendout.schema);
    if (!messages) return;

    await db.message.clearTable(ctx.session.sendout.schema);
    const server = new ServerManager();
    const menu = menuClear(ctx, await server.restartProcessOrNot(ctx.session.sendout.name, true));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default clearComposer;