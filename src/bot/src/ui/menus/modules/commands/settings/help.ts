import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from 'grammy';
import format from '@utils/formatting';
import constants from '@constants';

/**
 * Меню раздела help
 */
export default function help(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.settings.help.title"),
        ctx.t("modules.commands.settings.help.interest"),
        ctx.t("modules.commands.settings.help.path")
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .url(ctx.t("utils.shared.buttons.contactAdmin"), constants.link.tgAdmin)
        .row().text(ctx.t("utils.shared.buttons.back"), "mainSettings")
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}