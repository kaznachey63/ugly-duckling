import type { Contract } from '@shared/types/Contract';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/User';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела договоры
 */
function main(ctx: MyContext, amount: number, userIsAdmin: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.main.title"),
        ctx.t("modules.shared.contract.main.amount", { amount: amount }),
        "",
        ctx.t("modules.shared.contract.main.path")
    ].join('\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("modules.shared.contract.main.buttons.create"), "createContract").style("success");
    
    if (amount > 0) {
        keyboard
            .text(ctx.t("utils.shared.buttons.clear"), "clearContracts").style("danger").row()
            .text(ctx.t("utils.shared.buttons.view"), "viewContracts").style("primary")
        ;
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), userIsAdmin ? "mainPanel" : "mainCabinet");

    return { text: format.escapeMarkdown(text), keyboard }
}

function viewContracts(ctx: MyContext, contracts: Contract[]): Menu<InlineKeyboard> {   
    const text = [
        ctx.t("modules.shared.contract.view.contracts.title"),
        ctx.t("modules.shared.contract.view.contracts.path"),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    contracts.forEach((contract) => {
        keyboard.text(
            contract.user.name ?? ctx.t("utils.shared.buttons.nameless"),
            `viewContract#${contract.id}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainContracts");
    return { text: format.escapeMarkdown(text), keyboard }
}

function viewContract(ctx: MyContext, contract: Contract, userIsAdmin: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.view.contract.main.title"),
        ctx.t("modules.shared.contract.view.contract.main.path", { userName: contract.user.name ?? ctx.t("utils.shared.buttons.nameless") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.contract.view.contract.main.telegramId", { dateStart: contract.dateStart ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractDateStart#${contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.name", { dateEnd: contract.dateEnd ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractDateEnd#${contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.username", { price: contract.price ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractPrice#${contract.id}`).row()
    ;

    if (userIsAdmin) keyboard.text(ctx.t("modules.shared.contract.view.contract.main.remove"), `removeContract#${contract.id}`).style("danger").row()
    keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
    return { text: format.escapeMarkdown(text), keyboard }
}

// function create(ctx: MyContext): Menu<InlineKeyboard> {
//     const text = [
//         ctx.t("modules.commands.panel.users.create.title"),
//         ctx.t("modules.commands.panel.users.create.path")
//     ].join('\n\n');

//     const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainUsers");
//     return { text: format.escapeMarkdown(text), keyboard }
// }

// function remove(ctx: MyContext, user: User, result: boolean): Menu<InlineKeyboard> {
//     const keyboard = new InlineKeyboard();
//     let text = [
//         ctx.t("modules.commands.panel.users.view.user.remove.path", { userName: user.name })
//     ];

//     if (result) {
//         text.unshift(ctx.t("modules.commands.panel.users.view.user.remove.success"));
//         keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
//     }
//     else {
//         text.unshift(ctx.t("modules.commands.panel.users.view.user.remove.error"));
//         keyboard.text(ctx.t("utils.shared.buttons.back"), `viewUser#${user.id}`);
//     }
//     return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
// }

export default {
    main,
    viewContracts,
    viewContract,
    // create,
    // remove,
};