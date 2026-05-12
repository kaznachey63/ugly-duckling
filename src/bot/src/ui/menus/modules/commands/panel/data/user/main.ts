import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела пользователи
 */
export default function main(ctx: MyContext, amountOfUsers: number): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.user.main.title"),
        ctx.t("modules.commands.panel.data.user.main.amount", { amount: amountOfUsers }),
        "",
        ctx.t("modules.commands.panel.data.user.main.path")
    ].join('\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.create"), "createUser").style("success");
    
    if (amountOfUsers > 0) {
        keyboard
            .text(ctx.t("utils.shared.buttons.clear"), "clearUsers").style("danger").row()
            .text(ctx.t("utils.shared.buttons.view"), "viewUsers").style("primary")
        ;
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "mainData");

    return { text: format.escapeMarkdown(text), keyboard }
};