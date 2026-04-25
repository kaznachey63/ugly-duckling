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
        .text(ctx.t("modules.commands.panel.main.buttons.chats"), "mainChats").row()
        .text(ctx.t("modules.commands.panel.main.buttons.users"), "mainUsers").row()
        .text(ctx.t("modules.commands.panel.main.buttons.sendouts"), "mainSendouts").row()
        .text(ctx.t("modules.commands.panel.main.buttons.contracts"), "mainContracts").row()
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}