import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды panel
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text: string[] = [];
    const keyboard = new InlineKeyboard();

    switch (ctx.session.user.role_id) {
        case 1: {
            keyboard
                .text(ctx.t("modules.commands.panel.main.buttons.data"), "mainData")
                .text(ctx.t("modules.commands.panel.main.buttons.system"), "mainSystem")
                .row().text(ctx.t("modules.commands.cabinet.main.buttons.logout"), "logoutAuth")
            ;
            text.push(ctx.t("utils.shared.panel"));
            break;
        }
        case 2: {
            text.push(ctx.t("utils.shared.titles.accessDenied.customer"));
            break;
        }
        case 3: {
            text.push(ctx.t("utils.shared.titles.accessDenied.all"));
            break;
        }    
    }
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}