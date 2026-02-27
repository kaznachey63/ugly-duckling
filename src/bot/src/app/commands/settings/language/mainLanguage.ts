import type { MyContext } from '@shared/types/SessionData';
import menuLanguage from "@menus/commands/settings/language";

/**
 * Главная страница смены языка
 */
export default async function mainLanguage(ctx: MyContext) {
    const menu = menuLanguage(ctx);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
    await ctx.answerCallbackQuery();
}