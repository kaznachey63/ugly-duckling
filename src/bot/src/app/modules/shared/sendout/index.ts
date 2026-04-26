import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/shared/sendout/main';
import db from '@shared/db';
import common from '@utils/common';
import viewComposer from './view';

const sendoutComposer = new Composer<MyContext>();

sendoutComposer.callbackQuery("mainSendouts", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const menu = menuSendout(ctx, (await db.sendout.getAllSendouts())?.length!); // доработать метод бд
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

sendoutComposer.use(viewComposer);

export default sendoutComposer;