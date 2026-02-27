import type { MyContext } from '@shared/types/SessionData';

export default async function parametresMedia(ctx: MyContext) {
    
    await ctx.answerCallbackQuery({ text: ctx.t("distribution.sections.messages.media.parameteres.alert"), show_alert: true });
};