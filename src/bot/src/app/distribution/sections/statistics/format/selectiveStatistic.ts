import type { MyContext } from '@shared/types/SessionData';
import menuStatistic from "@menus/distribution/sections/statistic";

/**
 * Выборочная статистика. Календарь
 */
export default async function selectiveStatistic(ctx: MyContext) {
    const menu = menuStatistic.selective(ctx);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2",
    });
}