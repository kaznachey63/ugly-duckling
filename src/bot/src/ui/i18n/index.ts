import constants from '@constants';
import type { MyContext } from '@shared/types/SessionData';
import type { NextFunction } from 'grammy';
import type { LanguageCode } from "grammy/types";
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

const localesPath = path.join('src', 'ui', 'i18n', 'locales');
const defaultLocale: LanguageCode = 'ru';

// Инициализация i18next
i18next.use(Backend).init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    preload: constants.allowLanguages,
    backend: {
        loadPath: path.join(localesPath, '{{lng}}.json'),
    },
    interpolation: { escapeValue: true },
});

export const i18nMiddleware = async (ctx: MyContext, next: NextFunction) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) return await next();

    ctx.t = (key: string, options = {}) => i18next.t(key, { lng: ctx.session.user.language, ...options });
    await next();
};