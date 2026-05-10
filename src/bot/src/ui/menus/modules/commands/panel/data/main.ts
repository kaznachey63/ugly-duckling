import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела Данные
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.main.title"),
        ctx.t("modules.commands.panel.data.main.path"),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.buttons.chat"), "mainChat").row()
        .text(ctx.t("modules.commands.panel.data.main.buttons.user"), "mainUser").row()
        .text(ctx.t("utils.shared.buttons.sendout"), "mainSendout").row()
        .text(ctx.t("utils.shared.buttons.contract"), "mainContract").row()
        .text(ctx.t("utils.shared.buttons.back"), "mainPanel")
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}