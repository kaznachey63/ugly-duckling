import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuPanel from "@menus/modules/commands/panel/main";
import { Composer } from "grammy";

const maintenaceComposer = new Composer<MyContext>();

maintenaceComposer.callbackQuery("mainMaintenace", async (ctx: MyContext) => {
    const nextMode = !await db.general.maintenace();
    
    await db.general.setMaintenace(nextMode);
    
    const menu = menuPanel(ctx, nextMode);
    await ctx.editMessageReplyMarkup({ reply_markup: menu.keyboard });
    await ctx.answerCallbackQuery();
});

export default maintenaceComposer;