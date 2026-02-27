import type { MyContext } from '@shared/types/SessionData';

/**
 * Объявление о параметрах графика
 */
export default async function parameteresTime(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.schedule.parameteres.alert"), show_alert: true });
};