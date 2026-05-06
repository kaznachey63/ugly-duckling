import type { MyContext } from "@shared/types/SessionData";
import { Composer } from "grammy";
import menuData from "@menus/modules/commands/panel/data/main";
import chatComposer from "./chat";
import userComposer from "./user";

const dataComposer = new Composer<MyContext>();

dataComposer.callbackQuery("mainData", async (ctx: MyContext) => {
    try {
        const menu = menuData(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в mainData: ", error);
    } 
});

dataComposer.use(chatComposer);
dataComposer.use(userComposer);

export default dataComposer;