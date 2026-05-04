import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды panel
 */
export default function main(ctx: MyContext, maintenace: boolean): Menu<InlineKeyboard> {
    const text = ctx.t("modules.commands.panel.main.title");
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.buttons.chat"), "mainChat").row()
        .text(ctx.t("modules.commands.panel.main.buttons.user"), "mainUser").row()
        .text(ctx.t("utils.shared.buttons.sendout"), "mainSendout").row()
        .text(ctx.t("utils.shared.buttons.contract"), "mainContract").row()
        .text(
            maintenace ? '✔️ ' + ctx.t("utils.shared.buttons.maintenace") : '🔘 ' + ctx.t("utils.shared.buttons.maintenace"), 
            "mainMaintenace"
        ).row()
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}