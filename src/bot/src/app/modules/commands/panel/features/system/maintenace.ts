import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuSystem from "@menus/modules/commands/panel/system/main";
import { Composer } from "grammy";

const modeMaintenaceComposer = new Composer<MyContext>();

modeMaintenaceComposer.callbackQuery("mainModeMaintenace", async (ctx: MyContext) => {
    const nextMode = !await db.general.getModeMaintenace();
    
    await db.general.setModeMaintenace(nextMode);
    
    const menu = menuSystem(ctx, nextMode);
    await ctx.editMessageReplyMarkup({ reply_markup: menu.keyboard });
});

export default modeMaintenaceComposer;