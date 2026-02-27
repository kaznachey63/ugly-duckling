import type { MyContext } from '@shared/types/SessionData';
import menuStatistic from "@menus/distribution/sections/statistic";

/**
 * Выбор типа сравнительной статистики
 */
export default async function comparativeStatistic(ctx: MyContext) {    
    const menu = menuStatistic.comparative(ctx);
    try {
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch {
        try { await ctx.deleteMessage(); } catch { }
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    }
}
