import type { MyContext } from '@shared/types/SessionData';
import menuForm from "@menus/commands/form";

/**
 * Обработка команды form
 */
export default async function form(ctx: MyContext) {
    try {
        const menu = menuForm(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды form: ", error);
    }
}