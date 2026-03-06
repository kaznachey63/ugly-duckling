import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuChat from "@menus/commands/panel/chats";

/**
 * Обработка очистки чатов
 */
export default async function clearChats(ctx: MyContext) {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));
    await db.chat.clearTableChats();
    
    const menu = menuChat.clear(ctx, (await db.chat.getChats())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
}