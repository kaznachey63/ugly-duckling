import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuClear from '@menus/modules/shared/sendout/message/clear';
import { ServerManager } from "@common/services/ServerManager";
import { Composer } from 'grammy';
import common from '@utils/common';

const clearComposer = new Composer<MyContext>();

clearComposer.callbackQuery(/^clearMessages:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }
    
    const messages = await db.message.getMessages(ctx.session.sendout.id!);
    if (!messages) return;

    await db.message.clear(ctx.session.sendout.id!);
    const menu = menuClear(ctx, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default clearComposer;