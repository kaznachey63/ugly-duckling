import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела Система
 */
export default function main(ctx: MyContext, maintenace: boolean): Menu<InlineKeyboard> {
    const text = ctx.t("modules.commands.panel.main.title");
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.panel.system.main.buttons.server"), "mainServer").row()
        .text(
            maintenace ? ctx.t("modules.commands.panel.system.main.buttons.maintenace") + ' ✔️' : ctx.t("modules.commands.panel.system.main.buttons.maintenace") + ' 🔘', 
            "mainMaintenace"
        ).row()
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}