import type { MyContext } from '@shared/types/SessionData';
import menuStatistic from "@menus/distribution/sections/statistic";

/**
 * Главная страница статистики. Выбор статистики
 */
export default async function mainStatistic(ctx: MyContext) {
    const menu = menuStatistic.main(ctx);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    }); 
}