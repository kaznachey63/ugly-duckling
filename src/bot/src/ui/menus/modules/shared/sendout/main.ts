import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';

/**
 * Меню раздела рассылки
 */
export default function main(ctx: MyContext, amount: number): Menu<InlineKeyboard> {
    const userIsAdmin = ctx.session.isAdmin;
    let text = [
        "",
        ctx.t("modules.shared.sendout.main.path", { menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];
    
    const keyboard = new InlineKeyboard();
    
    if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.create"), "createSendout").style("success");

    if (amount > 0) {
        text.unshift(
            ctx.t("modules.shared.sendout.main.title"), 
            ctx.t("modules.shared.sendout.main.amount", { amount: amount })
        );
        
        if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.clear"), "clearSendouts").style("danger").row();

        keyboard.row().text(ctx.t("utils.shared.buttons.view"), "viewSendouts").style("primary");
    }
    else text.push(ctx.t("modules.shared.sendout.main.empty"));
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), userIsAdmin ? "mainPanel" : "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}