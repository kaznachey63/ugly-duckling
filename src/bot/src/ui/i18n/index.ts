import type { MyContext } from '@shared/types/SessionData';
import type { NextFunction } from 'grammy';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

const localesPath = path.join('src', 'ui', 'i18n', 'locales');
i18next.use(Backend).init({
    lng: 'ru',
    fallbackLng: 'ru',
    preload: ['ru', 'en'],
    backend: {
        loadPath: path.join(localesPath, '{{lng}}.json'),
    },
    interpolation: { escapeValue: true },
});

// Middleware для grammy
export const i18nMiddleware = async (ctx: MyContext, next: NextFunction) => {
    ctx.t = (key, options = {}) => {
        const lng = ctx.session?.languageCode || 'ru';
        return i18next.t(key, { lng, ...options });
    };
    await next();
};