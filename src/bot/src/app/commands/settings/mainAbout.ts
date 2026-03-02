import type { MyContext } from '@shared/types/SessionData';
import menuAbout from "@menus/commands/settings/about";

/**
 * Обработка команды about
 */
export default async function mainAbout(ctx: MyContext) {
    try {
        const menu = menuAbout(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды about: ", error);
    }
}