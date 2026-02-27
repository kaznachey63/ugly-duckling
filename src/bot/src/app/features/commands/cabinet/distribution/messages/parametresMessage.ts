import type { MyContext } from '@shared/types/SessionData';

export default async function parametresMessage(ctx: MyContext) {
    
    await ctx.answerCallbackQuery({ text: ctx.t("distribution.sections.messages.parameteres.alert"), show_alert: true });
};