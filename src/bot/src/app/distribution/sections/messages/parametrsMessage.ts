import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function parametrsMessage(ctx: MyContext) {
    
    await ctx.answerCbQuery("Параметры постов - 1 кнопка ниже", { show_alert: true });
};