import type { MyContext } from '@shared/types/SessionData';
import menuLanguage from "@menus/commands/settings/language";
import type { LanguageCode } from "grammy/types";
import i18next from 'i18next';
import db from '@shared/db';

export default async function changeLanguage(ctx: MyContext) {
    const languageCode = ctx.callbackQuery?.data?.split(/:/)[1]! as LanguageCode;
    const languageCodeFromDb = await db.user.getUserLang(ctx.from?.id!);

    if (languageCode == languageCodeFromDb) {
        return await ctx.answerCallbackQuery({
            text: ctx.t("commands.settings.language.change.error"),
            show_alert: true
        });
    }
    
    // Перебинд c новым языком
    await db.user.updateLangUser(ctx.from?.id!, languageCode);
    ctx.t = (key: string, options = {}) => {
        return i18next.t(key, { lng: languageCode, ...options });
    };

    await ctx.answerCallbackQuery(ctx.t("commands.settings.language.change.good"));

    const menu = menuLanguage(ctx, languageCode);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
}