import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuLanguage from '@menus/modules/commands/settings/language';
import i18next from 'i18next';
import db from '@shared/db';
import type { LanguagesALlowed } from '@shared/types/LanguagesAllowed';

const languageComposer = new Composer<MyContext>();

// Главная страница языка
languageComposer.callbackQuery('mainLanguage', async (ctx: MyContext) => {
    try {
        const menu = menuLanguage(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainLanguage', error);
    } 
});

// Смена языка (с параметром)
languageComposer.callbackQuery(/^changeLanguage:/, async (ctx: MyContext) => {
    try {
        const languageCode = ctx.callbackQuery?.data?.split(':')[1] as LanguagesALlowed;
        const currentLang = ctx.session.user.language;

        if (languageCode === currentLang) {
            return await ctx.answerCallbackQuery({
                text: ctx.t("modules.commands.settings.language.change.error"),
                show_alert: true
            });
        }

        await db.user.updateLang(BigInt(ctx.from?.id!), languageCode);

        ctx.t = (key: string, options = {}) => {
            return i18next.t(key, { lng: languageCode, ...options });
        };

        await ctx.answerCallbackQuery(ctx.t("modules.commands.settings.language.change.good"));
        ctx.session.user.language = languageCode;
        const menu = menuLanguage(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в changeLanguage', error);
    } 
});

export default languageComposer;