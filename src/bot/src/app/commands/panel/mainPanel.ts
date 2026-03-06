import type { MyContext } from '@shared/types/SessionData';
import menuPanel from "@menus/commands/panel/main";

/**
 * Обработка команды panel
 */
export default async function mainPanel(ctx: MyContext) {
    try {
        const menu = menuPanel(ctx);
        try {
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        } catch (error) {
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error("Ошибка в обработке команды panel: ", error);
    }
}