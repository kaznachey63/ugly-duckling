import constants from '@constants';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import { InlineKeyboard } from 'grammy';
import type { LanguageCode } from 'grammy/types';

/**
 * Меню смены языка
 */
export default function language(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.settings.language.main.title"),
        ctx.t("commands.settings.language.main.path"),
    ].join('\n\n');
    
    const languages: LanguageCode[] = constants.allowLanguages;
    const keyboard = new InlineKeyboard();
    
    for (const lang of languages) {
        const label = ctx.t(`commands.settings.language.main.buttons.${lang}`);
        keyboard.text(lang === ctx.session.user.language ? `${label} ☑️` : label, `changeLanguage:${lang}`);
    }
    
    keyboard.row().text(ctx.t("utils.shared.back"), "mainSettings");
    return { text: utils.formatting.escapeMarkdown(text), keyboard };
}