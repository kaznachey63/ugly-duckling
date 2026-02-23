import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function parametrsText(ctx: MyContext) {
    
    await ctx.answerCbQuery("Парамтеры текста - 2 кнопки ниже", { show_alert: true });
};