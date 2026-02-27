import type { MyContext } from '@shared/types/SessionData';

export default async function parametrsText(ctx: MyContext) {
    
    await ctx.answerCallbackQuery({ text: ctx.t("distribution.sections.messages.text.parameteres.alert"), show_alert: true });
};