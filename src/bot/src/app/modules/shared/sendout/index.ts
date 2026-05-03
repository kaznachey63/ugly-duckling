import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/shared/sendout/main';
import db from '@shared/db';
import common from '@utils/common';
import viewComposer from './view';

const sendoutComposer = new Composer<MyContext>();

sendoutComposer.callbackQuery("mainSendouts", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const sendoutsLength = ctx.session.isAdmin ? (await db.sendout.getSendouts())?.length! : (await db.sendout.getSendoutsOfUserId(BigInt(ctx.from?.id!)))?.length!;
    const menu = menuSendout(ctx, sendoutsLength);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

sendoutComposer.use(viewComposer);

export default sendoutComposer;