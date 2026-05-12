import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';

/**
 * Меню раздела Сервер
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.system.server.main.title"),
        ctx.t("modules.commands.panel.system.server.main.path"),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.buttons.sendout"), "mainProcess-sendout").row()
        .text(ctx.t("modules.commands.panel.system.server.main.buttons.bot"), "mainProcess-bot").row()
        .text(ctx.t("modules.commands.panel.system.server.main.buttons.parser"), "mainProcess-parser").row()
        .text(ctx.t("utils.shared.buttons.back"), "mainSystem");
    ;
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}