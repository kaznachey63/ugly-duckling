import type { MyContext } from '@shared/types/SessionData';
import type { NextFunction } from 'grammy';
import type { LanguageCode } from '@shared/types/LanguageCode';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

const localesPath = path.join('src', 'ui', 'i18n', 'locales');
const DEFAULT_LOCALE: LanguageCode = 'ru';

// 🔽 Функция маппинга прямо здесь
function getLocaleFromTelegram(tgLang: string | undefined): LanguageCode {
    if (!tgLang) return DEFAULT_LOCALE;

    // Нормализуем: 'zh-hans' -> 'zh', 'en-US' -> 'en'
    const base = tgLang.split('-')[0]!.toLowerCase();

    if (base === 'ru') return 'ru';
    if (base === 'en') return 'en';
    if (base === 'zh') return 'zh'; // Китайский -> zh

    return DEFAULT_LOCALE;
}

i18next.use(Backend).init({
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    preload: ['ru', 'en', 'zh'], // ✅ Коды совпадают с типом и файлами
    backend: {
        loadPath: path.join(localesPath, '{{lng}}.json'),
    },
    interpolation: { escapeValue: true },
});

export const i18nMiddleware = async (ctx: MyContext, next: NextFunction) => {
    const manualLang = ctx.session?.settings?.languageCode;
    const autoLang = ctx.from?.language_code ? getLocaleFromTelegram(ctx.from.language_code) : DEFAULT_LOCALE;

    const lng = manualLang || autoLang;

    // Сохраняем авто-язык в сессию при первом запуске
    if (!ctx.session?.settings?.languageCode && ctx.from?.language_code) {
        ctx.session.settings.languageCode = autoLang;
    }

    ctx.t = (key: string, options = {}) => {
        return i18next.t(key, { lng, ...options });
    };

    await next();
};