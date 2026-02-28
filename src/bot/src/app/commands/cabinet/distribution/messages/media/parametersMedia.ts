import type { MyContext } from '@shared/types/SessionData';

export default async function parametersMedia(ctx: MyContext) {
    
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.media.parameters.alert"), show_alert: true });
};