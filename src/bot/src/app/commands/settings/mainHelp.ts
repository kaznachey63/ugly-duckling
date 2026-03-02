import type { MyContext } from '@shared/types/SessionData';
import menuHelp from "@menus/commands/settings/help";

/**
 * Обработка команды help
 */
export default async function mainHelp(ctx: MyContext) {
    try {
        const menu = menuHelp(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды help:", error);
    }
}