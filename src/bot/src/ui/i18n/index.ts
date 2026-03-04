import type { MyContext } from '@shared/types/SessionData';
import type { NextFunction } from 'grammy';
import type { LanguageCode } from "grammy/types";
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

const localesPath = path.join('src', 'ui', 'i18n', 'locales');
const defaultLocale: LanguageCode = 'ru';

// 🔽 Функция маппинга прямо здесь
function getLocaleFromTelegram(tgLang: string | undefined): LanguageCode {
    if (!tgLang) return defaultLocale;

    // Нормализуем: 'zh-hans' -> 'zh', 'en-US' -> 'en'
    const base = tgLang.split('-')[0]!.toLowerCase();

    if (base === 'ru') return 'ru';
    if (base === 'en') return 'en';
    if (base === 'zh') return 'zh'; // Китайский -> zh

    return defaultLocale;
}

i18next.use(Backend).init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    preload: ['ru', 'en', 'zh'], // ✅ Коды совпадают с типом и файлами
    backend: {
        loadPath: path.join(localesPath, '{{lng}}.json'),
    },
    interpolation: { escapeValue: true },
});

export const i18nMiddleware = async (ctx: MyContext, next: NextFunction) => {
    const manualLang = ctx.session?.settings?.languageCode;
    const autoLang = ctx.from?.language_code ? getLocaleFromTelegram(ctx.from.language_code) : defaultLocale;

    let lng: string;

    // Присвоение языка пользователя из телеграм
    if (!manualLang || manualLang === 'auto') {
        lng = autoLang;
        if (ctx.session?.settings) {
            ctx.session.settings.languageCode = lng as LanguageCode;
        }
    } else {
        lng = manualLang;
    }

    ctx.t = (key: string, options = {}) => {
        return i18next.t(key, { lng, ...options });
    };

    await next();
};