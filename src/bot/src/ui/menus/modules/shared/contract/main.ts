import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела договоры
 */
export default function main(ctx: MyContext, amount: number): Menu<InlineKeyboard> {
    const userIsAdmin = ctx.session.isAdmin;
    let text = [
        "",
        ctx.t("modules.shared.contract.main.path", { menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ];
    
    const keyboard = new InlineKeyboard();
    
    if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.create"), "createContract").style("success");

    if (amount > 0) {
        text.unshift(
            ctx.t("modules.shared.contract.main.title"), 
            ctx.t("modules.shared.contract.main.amount", { amount: amount })
        );
        
        if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.clear"), "clearContracts").style("danger").row();

        keyboard.row().text(ctx.t("utils.shared.buttons.view"), "viewContracts").style("primary");
    }
    else text.unshift(ctx.t("modules.shared.contract.main.empty"));
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), userIsAdmin ? "mainData" : "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}