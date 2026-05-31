import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню команды cabinet
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text: string[] = [];
    const keyboard = new InlineKeyboard();

    switch (ctx.session.user.role_id) {
        case 1: {
            text.push(ctx.t("utils.shared.titles.accessDenied.admin"));
            break;
        }
        case 2: {
            keyboard
                .text(ctx.t("utils.shared.buttons.sendout"), "mainSendout")
                .text(ctx.t("utils.shared.buttons.contract"), "mainContract")
                .row().text(ctx.t("modules.commands.cabinet.main.buttons.logout"), "logoutAuth");
            ;
            text.push(ctx.t("utils.shared.cabinet"));
        }
        case 3: {
            text.push(ctx.t("utils.shared.titles.accessDenied.all"));
            break;
        }
    }

    return { text: format.escapeMarkdown(text.join('\n')), keyboard };
}