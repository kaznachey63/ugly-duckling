import type { MyContext } from '@shared/types/SessionData';
import menuLanguage from "@menus/commands/settings/language";

/**
 * Смена языка
 */
export default async function changeLanguage(ctx: MyContext) {
    const languageCode = ctx.callbackQuery?.data?.split(/:/)[1]!;
    if (ctx.session.languageCode == languageCode) {
        await ctx.answerCallbackQuery({ text: ctx.t("commands.settings.language.change.error"), show_alert: true });
    }
    else {
        ctx.session.languageCode = languageCode;
        const menu = menuLanguage(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });

        await ctx.answerCallbackQuery(ctx.t("commands.settings.language.change.good"));
    }
}