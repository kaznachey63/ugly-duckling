import type { Contract } from '@shared/types/DB';
import type { ExportType } from '@shared/types/ExportType';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела договоры
 */
function main(ctx: MyContext, amount: number): Menu<InlineKeyboard> {
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
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), userIsAdmin ? "mainPanel" : "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}

function viewContracts(ctx: MyContext, contracts: Contract[]): Menu<InlineKeyboard> {   
    const userIsAdmin = ctx.session.isAdmin;
    const text = [
        ctx.t("modules.shared.contract.view.main.title"),
        ctx.t("modules.shared.contract.view.main.path",  { menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    contracts.forEach((contract) => {
        keyboard.text(
            ctx.t("modules.shared.contract.main.contractName", { 
                userName: contract.user?.name ?? ctx.t("utils.shared.buttons.nameless"),
                dateStart: new Date(contract.date_start!).toLocaleDateString('ru-RU')
            }),
            `viewContract#${contract.id}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainContract");
    return { text: format.escapeMarkdown(text), keyboard }
}

function viewContract(ctx: MyContext, sendoutsCall: string): Menu<InlineKeyboard> {
    const userIsAdmin = ctx.session.isAdmin;
    const text = [
        ctx.t("modules.shared.contract.view.contract.main.title", { dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') }),
        ctx.t("modules.shared.contract.view.contract.main.sendouts", { sendouts: sendoutsCall }),
        ctx.t("modules.shared.contract.view.contract.main.path", { 
            dateStart: new Date(ctx.session.contract.date_start!), 
            menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") 
        }),
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.contract.view.contract.main.userName", { userName: ctx.session.contract.user?.name ?? ctx.t("utils.shared.buttons.nameless") }), `updateOrRemoveContractUser#${ctx.session.contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.dateStart", { dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractDateStart#${ctx.session.contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.dateEnd", { dateEnd: ctx.session.contract.date_end ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractDateEnd#${ctx.session.contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.price", { price: ctx.session.contract.price ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractPrice#${ctx.session.contract.id}`).row()
        .text(ctx.t("modules.shared.contract.view.contract.main.priceText", { priceText: ctx.session.contract.price_text ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveContractPriceText#${ctx.session.contract.id}`).row()
        .text(ctx.t("utils.shared.buttons.export"), `mainExportContract#${ctx.session.contract.id}`)
    ;

    if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.remove"), `removeContract#${ctx.session.contract.id}`).style("danger")
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "viewContracts");
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.shared.contract.view.contract.remove.path", { dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') })
    ];

    if (result) {
        text.unshift(ctx.t("modules.shared.contract.view.contract.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
    }
    else {
        text.unshift(ctx.t("modules.shared.contract.view.contract.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewUser#${ctx.session.contract.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.view.contract.create.title"),    
        ctx.t("modules.shared.contract.view.contract.create.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainContract");
    return { text: format.escapeMarkdown(text), keyboard }
}

function mainExportContract(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.view.contract.export.main.title"),
        ctx.t("modules.shared.contract.view.contract.export.main.path",  { 
            menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet"), 
            dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') 
        }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text("PDF", `exportContract#${ctx.session.contract.id}-pdf`)
        .text("Word", `exportContract#${ctx.session.contract.id}-word`)   
        .row().text(ctx.t("utils.shared.buttons.back"), `viewContract#${ctx.session.contract.id}`)
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

function exportContract(ctx: MyContext, exportType: ExportType, result: boolean): Menu<InlineKeyboard> {
    const userIsAdmin = ctx.session.isAdmin;
    const text = [
        result ? 
            ctx.t("modules.shared.contract.view.contract.export.result.caption", { exportType: exportType }) :
            ctx.t("modules.shared.contract.view.contract.export.result.error")
        ,
        ctx.t("modules.shared.contract.view.contract.export.result.path", { 
            call: ctx.session.sendout.call, 
            exportType: exportType, 
            menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet"), 
            dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU')
        }),
    ].join('\n');

    const keyboard = new InlineKeyboard().row().text(ctx.t("utils.shared.buttons.back"), `viewContract#${ctx.session.contract.id}`);
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    viewContracts,
    viewContract,
    remove,
    create,
    mainExportContract,
    exportContract,
};