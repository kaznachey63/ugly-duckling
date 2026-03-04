import type { MyContext } from '@shared/types/SessionData';
import menuLanguage from "@menus/commands/settings/language";
import db from '@shared/db';

/**
 * Главная страница смены языка
 */
export default async function mainLanguage(ctx: MyContext) {
    const menu = menuLanguage(ctx, await db.user.getUserLang(ctx.from?.id!));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
}