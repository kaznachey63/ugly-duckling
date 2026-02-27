import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды help
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t("commands.settings.main.title");
    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.settings.main.buttons.language"), "mainLanguage").row()
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}