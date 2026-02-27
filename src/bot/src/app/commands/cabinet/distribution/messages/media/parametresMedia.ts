import type { MyContext } from '@shared/types/SessionData';

export default async function parametresMedia(ctx: MyContext) {
    
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.media.parameteres.alert"), show_alert: true });
};