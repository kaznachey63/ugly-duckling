import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function parametrsMedia(ctx: MyContext) {
    
    await ctx.answerCbQuery("Парамтеры медиа - 2 кнопки ниже", { show_alert: true });
};