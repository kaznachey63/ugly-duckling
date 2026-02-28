import type { MyContext } from '@shared/types/SessionData';
import menuLanguage from "@menus/commands/settings/language";
import type { LanguageCode } from '@shared/types/LanguageCode';
import i18next from 'i18next'; // <-- Добавь этот импорт

export default async function changeLanguage(ctx: MyContext) {
    const languageCode = ctx.callbackQuery?.data?.split(/:/)[1]!;

    if (ctx.session.settings.languageCode == languageCode) {
        return await ctx.answerCallbackQuery({
            text: ctx.t("commands.settings.language.change.error"),
            show_alert: true
        });
    }
    else {
        ctx.session.settings.languageCode = languageCode as LanguageCode;

        // 2. 🔥 ПЕРЕБИНДИМ ctx.t с новым языком
        ctx.t = (key: string, options = {}) => {
            return i18next.t(key, { lng: languageCode, ...options });
        };

        await ctx.answerCallbackQuery(ctx.t("commands.settings.language.change.good"));
    }

    const menu = menuLanguage(ctx);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
}