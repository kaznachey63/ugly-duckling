import type { MyContext } from '@shared/types/SessionData';

export default async function parametersText(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.text.parameters.alert"), show_alert: true });
};