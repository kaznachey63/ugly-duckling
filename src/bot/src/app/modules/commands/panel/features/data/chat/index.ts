import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuChat from "@menus/modules/commands/panel/data/chat/main";
import { Composer } from "grammy";
import controlComposer from './control';

const chatComposer = new Composer<MyContext>();

/**
 * Главная страница раздела чаты
 */
chatComposer.callbackQuery("mainChat", async (ctx: MyContext) => {
    const menu = menuChat(ctx, (await db.chat.get())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

chatComposer.use(controlComposer);

export default chatComposer;