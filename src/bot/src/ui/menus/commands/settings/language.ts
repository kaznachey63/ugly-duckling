import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import { InlineKeyboard } from 'grammy';

/**
 * Меню смены языка
 */
export default function language(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.settings.language.main.title"),
        ctx.t("commands.settings.language.main.path"),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(
            ctx.session.settings.languageCode == 'ru' ?
                ctx.t("commands.settings.language.main.buttons.ru") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.ru"), 
            "changeLanguage:ru"
        )
        .text(
            ctx.session.settings.languageCode == 'en' ?
                ctx.t("commands.settings.language.main.buttons.en") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.en"), 
            "changeLanguage:en"
        )
        .text(
            ctx.session.settings.languageCode == 'zh' ?
                ctx.t("commands.settings.language.main.buttons.zh") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.zh"), 
            "changeLanguage:zh"
        ).row()
        .text(ctx.t("utils.shared.back"), "mainSettings")
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}