import type { MyContext } from '@shared/types/SessionData';

/**
 * Объявление о параметрах графика
 */
export default async function parametrsTime(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("distribution.section.shedule.parameters.alert"), show_alert: true });
};