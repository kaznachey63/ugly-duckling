import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuView from "@menus/modules/shared/sendout/view";
import { Composer } from "grammy";

const modeTestComposer = new Composer<MyContext>();

modeTestComposer.callbackQuery(/^mainModeTest#/, async (ctx: MyContext) => {
    ctx.session.sendout.mode_test = !ctx.session.sendout.mode_test;
    
    await db.sendout.setModeTest(ctx.session.sendout.id!, ctx.session.sendout.mode_test);
    
    const menu = menuView(ctx);
    await ctx.editMessageReplyMarkup({ reply_markup: menu.keyboard });
});

export default modeTestComposer;