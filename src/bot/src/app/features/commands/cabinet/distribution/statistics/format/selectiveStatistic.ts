import type { MyContext } from '@shared/types/SessionData';
import menuStatistic from "@menus/commands/cabinet/distribution/sections/statistic";

/**
 * Выборочная статистика. Календарь
 */
export default async function selectiveStatistic(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("distribution.sections.statistics.selective.notDone"), show_alert: true });
    // const menu = menuStatistic.selective(ctx);
    // await ctx.editMessageText(menu.text, {
    //     reply_markup: menu.keyboard,
    //     parse_mode: "MarkdownV2",
    // });
}