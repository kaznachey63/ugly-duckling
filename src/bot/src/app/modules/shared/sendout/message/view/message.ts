import db from '@shared/db';
import { Composer } from 'grammy';
import menuView from '@menus/modules/shared/sendout/message/view';
import { ServerManager } from "src/common/services/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import common from '@utils/common';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^removeMessage:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }
    
    const message = await db.message.getById(Number(ctx.callbackQuery?.data?.split(':')[1]!.split('#')[1]));

    await db.message.remove(message?.id!);
    const menu = menuView.removeMessage(ctx, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true));

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

messageComposer.callbackQuery(/^paginationMessages:/, async (ctx: MyContext) => {
    const messages = await db.message.getMessages(ctx.session.sendout.id!);
    const menu = menuView.pagination(ctx, messages);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default messageComposer;