import type { Contract } from '@shared/types/Contract';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/User';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела пользователи
 */
function main(ctx: MyContext, amount: number): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.contracts.main.title"),
        ctx.t("modules.commands.panel.contracts.main.amount", { amount: amount }),
        "",
        ctx.t("modules.commands.panel.contracts.main.path")
    ].join('\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("modules.commands.panel.contracts.main.buttons.create"), "createContract").style("success");
    
    if (amount > 0) {
        keyboard
            .text(ctx.t("utils.shared.buttons.clear"), "clearContracts").style("danger").row()
            .text(ctx.t("utils.shared.buttons.view"), "viewContracts").style("primary")
        ;
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "mainPanel");

    return { text: format.escapeMarkdown(text), keyboard }
}

function viewContracts(ctx: MyContext, contracts: Contract[]): Menu<InlineKeyboard> {   
    const text = [
        ctx.t("modules.commands.panel.contracts.view.contracts.title"),
        ctx.t("modules.commands.panel.contracts.view.contracts.path"),
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

function viewUser(ctx: MyContext, user: User): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.users.view.user.main.title"),
        ctx.t("modules.commands.panel.users.view.user.main.path", { userName: user.name ?? ctx.t("utils.shared.buttons.nameless") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.panel.users.view.user.main.telegramId", { telegramId: user.telegramId ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveUserTgId#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.users.view.user.main.name", { name: user.name ?? ctx.t("utils.shared.buttons.nameless") }), `updateOrRemoveUserName#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.users.view.user.main.username", { username: user.username ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveUserUsername#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.users.view.user.main.phone", { phone: user.phone ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveUserPhone#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.users.view.user.main.language", { language: ctx.t(`utils.languages.${user.language}`) }), `updateOrRemoveUserLanguage#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.users.view.user.main.role", { role:  ctx.t(`utils.roleCodes.${user.role.code}`) }), `updateOrRemoveUserLanguage#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.users.view.user.main.remove"), `removeUser#${user.id}`).style("danger").row()
        .text(ctx.t("utils.shared.buttons.back"), "viewUsers");
    ; 
    return { text: format.escapeMarkdown(text), keyboard }
}

function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.users.create.title"),
        ctx.t("modules.commands.panel.users.create.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainUsers");
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, user: User, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.commands.panel.users.view.user.remove.path", { userName: user.name })
    ];

    if (result) {
        text.unshift(ctx.t("modules.commands.panel.users.view.user.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
    }
    else {
        text.unshift(ctx.t("modules.commands.panel.users.view.user.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewUser#${user.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

export default {
    main,
    viewContracts,
    viewUser,
    create,
    remove,
};