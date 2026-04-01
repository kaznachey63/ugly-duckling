import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import { InlineKeyboard } from 'grammy';
import type { LanguageCode } from 'grammy/types';

/**
 * Меню смены языка
 */
export default function language(ctx: MyContext, languageCode: LanguageCode): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.settings.language.main.title"),
        ctx.t("commands.settings.language.main.path"),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(
            languageCode == 'ru' ?
                ctx.t("commands.settings.language.main.buttons.ru") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.ru"), 
            "changeLanguage:ru"
        )
        .text(
            languageCode == 'en' ?
                ctx.t("commands.settings.language.main.buttons.en") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.en"), 
            "changeLanguage:en"
        )
        .text(
            languageCode == 'zh' ?
                ctx.t("commands.settings.language.main.buttons.zh") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.zh"), 
            "changeLanguage:zh"
        )
        .text(
            languageCode == 'sr' ?
                ctx.t("commands.settings.language.main.buttons.sr") + ' ☑️' :
                ctx.t("commands.settings.language.main.buttons.sr"), 
            "changeLanguage:sr"
        ).row()
        .text(ctx.t("utils.shared.back"), "mainSettings")
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}