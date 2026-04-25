import constants from '@constants';
import type { LanguagesALlowed } from '@shared/types/LanguagesAllowed';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import localization from '@utils/localization';
import { InlineKeyboard } from 'grammy';

/**
 * Меню смены языка
 */
export default function language(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.settings.language.main.title"),
        ctx.t("modules.commands.settings.language.main.path"),
    ].join('\n\n');
    
    const languages: LanguagesALlowed[] = constants.allowLanguages;
    const keyboard = new InlineKeyboard();
    
    for (const lang of languages) {
        const label = localization.getContryFlagOfCode(lang);
        keyboard.text(lang === ctx.session.user.language ? `${label} ☑️` : label, `changeLanguage:${lang}`);
    }
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "mainSettings");
    return { text: utils.formatting.escapeMarkdown(text), keyboard };
}