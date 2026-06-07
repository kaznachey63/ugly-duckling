import type { Contract } from '@shared/types/DB';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import common from '@utils/common';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

function contracts(ctx: MyContext, contracts: Contract[]): Menu<InlineKeyboard> {   
    const userIsAdmin = ctx.session.isAdmin;
    const text = [
        ctx.t("modules.shared.contract.view.main.title"),
        ctx.t("modules.shared.contract.view.main.path",  { menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    contracts.forEach((contract) => {
        keyboard.text(
            ctx.t("modules.shared.contract.main.contractName", { 
                userName: contract.user?.name ?? ctx.t("utils.shared.nameless"),
                dateStart: common.getCurrentDate(contract.date_start!)
            }),
            `viewContract#${contract.id}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainContract");
    return { text: format.escapeMarkdown(text), keyboard }
}

function contract(ctx: MyContext, sendoutsCall: string): Menu<InlineKeyboard> {
    const userIsAdmin = ctx.session.isAdmin;
    const text = [
        ctx.t("modules.shared.contract.view.contract.main.title", { dateStart: common.getCurrentDate(ctx.session.contract.date_start!) }),
        ctx.t("modules.shared.contract.view.contract.main.sendouts", { sendouts: sendoutsCall.length > 0 ? sendoutsCall : ctx.t("modules.shared.contract.view.contract.main.noSendouts") }),
        ctx.t("modules.shared.contract.view.contract.main.path", { 
            dateStart: common.getCurrentDate(ctx.session.contract.date_start!), 
            menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") 
        }),
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.contract.view.contract.main.userName", { userName: ctx.session.contract.user?.name ?? ctx.t("utils.shared.nameless") }), '#').row()
        .text(ctx.t("modules.shared.contract.view.contract.main.dateStart", { dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') }), '#').row()
        .text(ctx.t("modules.shared.contract.view.contract.main.dateEnd", { dateEnd: new Date(ctx.session.contract.date_end!).toLocaleDateString('ru-RU') }), '#').row()
        .text(ctx.t("modules.shared.contract.view.contract.main.price", { price: ctx.session.contract.price }), '#').row()
        .text(ctx.t("modules.shared.contract.view.contract.main.priceText", { priceText: ctx.session.contract.price_text }), '#').row()
        .text(ctx.t("utils.shared.buttons.export"), `mainExportContract#${ctx.session.contract.id}`)
    ;

    if (userIsAdmin) keyboard.text(ctx.t("utils.shared.buttons.remove"), `removeContract#${ctx.session.contract.id}`).style("danger")
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "viewContracts");
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    contracts,
    contract,
};