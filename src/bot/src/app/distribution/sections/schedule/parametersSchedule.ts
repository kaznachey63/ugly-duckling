import type { MyContext } from '@shared/types/SessionData';

/**
 * Объявление о параметрах графика
 */
export default async function parametersTime(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("distribution.sections.schedule.parameters.alert"), show_alert: true });
};