import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuSystem from "@menus/modules/commands/panel/system/main";
import { Composer } from "grammy";

const maintenaceComposer = new Composer<MyContext>();

maintenaceComposer.callbackQuery("mainMaintenace", async (ctx: MyContext) => {
    const nextMode = !await db.general.maintenace();
    
    await db.general.setMaintenace(nextMode);
    
    const menu = menuSystem(ctx, nextMode);
    await ctx.editMessageReplyMarkup({ reply_markup: menu.keyboard });
});

export default maintenaceComposer;