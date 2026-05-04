import type { MyContext } from "@shared/types/SessionData";
import { Composer } from "grammy";
import menuPanel from "@menus/modules/commands/panel/main";
import chatsComposer from "./features/chat";
import usersComposer from "./features/user";

const panelComposer = new Composer<MyContext>();

panelComposer.command('panel', async (ctx: MyContext) => {
    if (ctx.session.isAdmin) {
        const menu = menuPanel(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    }
});

panelComposer.callbackQuery("mainPanel", async (ctx: MyContext) => {
    try {
        const menu = menuPanel(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в panel: ", error);
    } finally {
        
    }
});


panelComposer.use(chatsComposer);
panelComposer.use(usersComposer);

export default panelComposer;