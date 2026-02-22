import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function parametrsTime(ctx: MyContext) {
    await ctx.answerCbQuery("Параметры Графика - кнопки ниже", { show_alert: true });
};