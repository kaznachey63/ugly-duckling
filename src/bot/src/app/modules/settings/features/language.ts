import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { LanguageCode } from 'grammy/types';
import menuLanguage from '@menus/modules/settings/language';
import i18next from 'i18next';
import db from '@shared/db';

const languageComposer = new Composer<MyContext>();

// Главная страница языка
languageComposer.callbackQuery('mainLanguage', async (ctx: MyContext) => {
    try {
        const userLang = ctx.session.user.language;
        const menu = menuLanguage(ctx, userLang);
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
        const languageCode = ctx.callbackQuery?.data?.split(':')[1] as LanguageCode;
        const currentLang = ctx.session.user.language;

        if (languageCode === currentLang) {
            return await ctx.answerCallbackQuery({
                text: ctx.t('commands.cabinet.profile.language.change.error'),
                show_alert: true
            });
        }

        await db.user.updateLang(ctx.from?.id!, languageCode);

        ctx.t = (key: string, options = {}) => {
            return i18next.t(key, { lng: languageCode, ...options });
        };

        await ctx.answerCallbackQuery(ctx.t('commands.cabinet.profile.language.change.good'));

        const menu = menuLanguage(ctx, languageCode);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в changeLanguage', error);
    } 
});

export default languageComposer;