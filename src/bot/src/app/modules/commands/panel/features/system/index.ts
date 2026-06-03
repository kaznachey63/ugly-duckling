import type { MyContext } from "@shared/types/SessionData";
import { Composer } from "grammy";
import menuSystem from "@menus/modules/commands/panel/system/main";
import maintenaceComposer from "./maintenace";
import db from "@shared/db";
import serverComposer from "./server";

const systemComposer = new Composer<MyContext>();

systemComposer.callbackQuery("mainSystem", async (ctx: MyContext) => {
    try {
        const menu = menuSystem(ctx, await db.general.getModeMaintenace());
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в mainSystem: ", error);
    }
});

systemComposer.use(maintenaceComposer);
systemComposer.use(serverComposer);

export default systemComposer;