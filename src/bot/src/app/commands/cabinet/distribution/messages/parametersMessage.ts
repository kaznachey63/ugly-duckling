import type { MyContext } from '@shared/types/SessionData';

export default async function parametersMessage(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.parameters.alert"), show_alert: true });
};