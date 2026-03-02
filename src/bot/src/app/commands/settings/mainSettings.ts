import type { MyContext } from '@shared/types/SessionData';
import menuSettings from "@menus/commands/settings/main";

/**
 * Обработка команды settings
 */
export default async function settings(ctx: MyContext) {
    try {
        const menu = menuSettings(ctx);
        try {
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        } catch {
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
       
    } catch (error) {
        console.error("Ошибка в обработке команды settings:", error);
    }
}