import type { MyContext } from "@shared/types/SessionData";
import { Composer } from "grammy";
import menuPanel from "@menus/commands/panel/main";
import common from '@utils/common';
import chatsComposer from "./features/chats";

const panelComposer = new Composer<MyContext>();

// ✅ Команда внутри композера
panelComposer.command('panel', async (ctx: MyContext) => {
    if (common.isAdmin(ctx.from?.id!)) {
        const menu = menuPanel(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    }
});

// ✅ Колбэки внутри композера
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

/**
 * Подключение раздела чаты
 */
panelComposer.use(chatsComposer);

export default panelComposer;