import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню команды cabinet
 */
export default function main(ctx: MyContext, userexists: boolean, userIsAdmin: boolean ): Menu<InlineKeyboard> {
    const text = [
        ctx.t("utils.shared.cabinet")
    ].join('\n');

    const keyboard = new InlineKeyboard();

    if (userexists && !userIsAdmin) {
        keyboard
            .text(ctx.t("utils.shared.buttons.sendouts"), "mainSendouts")
            .text(ctx.t("utils.shared.buttons.contracts"), "mainContracts")
        ;
    } 

    if (userexists) keyboard.row().text(ctx.t("modules.commands.cabinet.main.buttons.logout"), "logoutAuth");

    else keyboard.text(ctx.t("modules.commands.cabinet.main.buttons.login"), "loginAuth").row()

    return { text: format.escapeMarkdown(text), keyboard };
}