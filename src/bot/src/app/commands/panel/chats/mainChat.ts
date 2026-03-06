import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuChat from "@menus/commands/panel/chats";

/**
 * Главная страница раздела чаты
 */
export default async function mainChat(ctx: MyContext) {
    const menu = menuChat.main(ctx, (await db.chat.getChats())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
}