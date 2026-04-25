import type { Contract } from '@shared/types/Contract';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела договоры
 */
function main(ctx: MyContext, amount: number, userIsAdmin: boolean): Menu<InlineKeyboard> {
    let text = [
        "",
        ctx.t("modules.shared.contract.main.path")
    ];
    
    const keyboard = new InlineKeyboard();
    
    if (userIsAdmin) keyboard.text(ctx.t("modules.shared.contract.main.buttons.create"), "createContract").style("success");

    if (amount > 0) {
        text.unshift(
            ctx.t("modules.shared.contract.main.title"), 
            ctx.t("modules.shared.contract.main.amount", { amount: amount })
        );
        
        if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.clear"), "clearContracts").style("danger").row();

        keyboard.row().text(ctx.t("utils.shared.buttons.view"), "viewContracts").style("primary");
    }
    else text.push(ctx.t("modules.shared.contract.main.empty"));
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), userIsAdmin ? "mainPanel" : "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
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
        .text(ctx.t("modules.shared.contract.view.contract.main.userName", { userName: contract.user.name ?? ctx.t("utils.shared.buttons.nameless") }), `updateOrRemoveContractUser#${contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.dateStart", { dateStart: contract.dateStart ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractDateStart#${contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.dateEnd", { dateEnd: contract.dateEnd ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractDateEnd#${contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.price", { price: contract.price ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractPrice#${contract.id}`).row()
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

// import type { MyContext } from '@shared/types/SessionData';
// import type { Menu } from "@shared/types/Menu";
// import { InlineKeyboard } from "grammy";
// import format from "@utils/formatting";
// import common from '@utils/common';
// import type { Contract } from '@shared/types/Contract';
// import type { ExportType } from '@shared/types/ExportType';


// function main2(ctx: MyContext, errorWithData: true): Menu<InlineKeyboard>
// function main2(ctx: MyContext, contractInfo: Contract[], errorWithData: false): Menu<InlineKeyboard>
// function main2(ctx: MyContext, contractInfoOrError: Contract[] | boolean, errorWithData?: boolean): Menu<InlineKeyboard> {

//     const is_error = typeof contractInfoOrError === 'boolean' ? contractInfoOrError : (errorWithData ?? false)
//     const info = typeof contractInfoOrError === 'boolean' ? undefined : contractInfoOrError

//     let textLines: string[] = []

//     if (is_error) {
//         textLines = [
//             ctx.t("modules.commands.cabinet.profile.contract.main.title"),
//             ctx.t("modules.commands.cabinet.profile.contract.main.error")
//         ]
//     }
//     else if (info) {
//         textLines = [
//             ctx.t("modules.commands.cabinet.profile.contract.main.title"),
//             ctx.t("modules.commands.cabinet.profile.contract.main.customer", { customer: info[0]?.customerName }),
//             ctx.t("modules.commands.cabinet.profile.contract.main.dateStart", { dateStart: info[0]?.dateStart }),
//             ctx.t("modules.commands.cabinet.profile.contract.main.dateStop", { dateStop: info[0]?.dateEnd }),
//             ctx.t("modules.commands.cabinet.profile.contract.main.path", { call: ctx.session.sendout.call })
//         ]
//     }

//     const text = format.escapeMarkdown(textLines.join('\n'))

//     const keyboard = new InlineKeyboard()
//         .text(ctx.t("utils.shared.export"), `mainExportContract:${ctx.session.sendout.name}`)
//         .row().text(ctx.t("utils.shared.buttons.back"), `mainDistribution:${ctx.session.sendout.name}`)
//     ;

//     return { text, keyboard }
// }

// function mainExportContract(ctx: MyContext): Menu<InlineKeyboard> {
//     const text = [
//         ctx.t("modules.commands.cabinet.profile.contract.export.main.title"),
//         ctx.t("modules.commands.cabinet.profile.contract.export.main.path", { call: ctx.session.sendout.call }),
//     ].join('\n\n');
    
//     const keyboard = new InlineKeyboard()
//         .text("PDF", `exportContract:${ctx.session.sendout.name}-pdf`)
//         .text("Word", `exportContract:${ctx.session.sendout.name}-word`)   
//         .row().text(ctx.t("utils.shared.buttons.back"), `mainContract:${ctx.session.sendout.name}`)
//     ;
    
//     return { text: format.escapeMarkdown(text), keyboard }
// }

// function exportContract(ctx: MyContext, exportType: ExportType, result: boolean): Menu<InlineKeyboard> {
//     const text = [
//         result ? 
//             ctx.t("modules.commands.cabinet.profile.contract.export.result.caption", { exportType: exportType }) :
//             ctx.t("modules.commands.cabinet.profile.contract.export.result.error")
//         ,
//         ctx.t("modules.commands.cabinet.profile.contract.export.result.path", { call: ctx.session.sendout.call, exportType: exportType }),
//     ].join('\n');

//     const keyboard = new InlineKeyboard().row().text(ctx.t("utils.shared.buttons.back"), `mainContract:${ctx.session.sendout.name}`);
    
//     return { text: format.escapeMarkdown(text), keyboard }
// }