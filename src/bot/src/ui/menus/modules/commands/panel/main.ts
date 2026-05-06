import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды panel
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t("modules.commands.panel.main.title");
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.panel.main.buttons.data"), "mainData")
        .text(ctx.t("modules.commands.panel.main.buttons.system"), "mainSystem")
    ;

    return { text: format.escapeMarkdown(text), keyboard }
}