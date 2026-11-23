import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuView from "@menus/modules/shared/sendout/view";
import { Composer } from "grammy";
import { ServerManager } from "@common/services/ServerManager";

const modeTestComposer = new Composer<MyContext>();

modeTestComposer.callbackQuery(/^mainModeTest:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) return await ctx.answerCallbackQuery({ show_alert: true, text: ctx.t("modules.shared.sendout.view.test.alert") });
    const sendoutId = Number(ctx?.callbackQuery?.data?.split(/:/)[1]!);

    ctx.session.sendout.mode_test = !ctx.session.sendout.mode_test;
    await db.sendout.setModeTest(sendoutId, ctx.session.sendout.mode_test);
    
    // рестарт процесса 
    const sendoutName = (await db.sendout.getSendoutInfo(sendoutId))?.name!;
    await ServerManager.restartProcessOrNot(sendoutName, true);
    
    const menu = menuView(ctx);
 
    await ctx.editMessageReplyMarkup({ reply_markup: menu.keyboard });
});

export default modeTestComposer;