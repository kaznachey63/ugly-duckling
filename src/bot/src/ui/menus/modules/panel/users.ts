import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/User';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела пользователи
 */
function main(ctx: MyContext, amountOfUsers: number): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.panel.users.main.title"),
        ctx.t("commands.panel.users.main.amount", { amount: amountOfUsers }),
        "",
        ctx.t("commands.panel.users.main.path")
    ].join('\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("commands.panel.users.main.buttons.create"), "createUser").style("success");
    
    if (amountOfUsers > 0) {
        keyboard
            .text(ctx.t("commands.panel.users.main.buttons.clear"), "clearUsers").style("danger").row()
            .text(ctx.t("commands.panel.users.main.buttons.view"), "viewUsers").style("primary")
        ;
    }

    keyboard.row().text(ctx.t("utils.shared.back"), "mainPanel");

    return { text: format.escapeMarkdown(text), keyboard }
}

function viewUsers(ctx: MyContext, users: User[]): Menu<InlineKeyboard> {   
    const text = [
        ctx.t("commands.panel.users.view.users.title"),
        ctx.t("commands.panel.users.view.users.path"),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    users.forEach((user) => {
        keyboard.text(
            user.name ?? ctx.t("commands.panel.users.view.user.main.nameless"),
            `viewUser#${user.id}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.back"), "mainUsers");
    return { text: format.escapeMarkdown(text), keyboard }
}

function viewUser(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.panel.users.view.user.main.title"),
        ctx.t("commands.panel.users.view.user.main.path", { userName: ctx.session.user.name ?? ctx.t("commands.panel.users.view.user.main.nameless") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.panel.users.view.user.main.telegramId", { telegramId: ctx.session.user.telegramId ?? ctx.t("commands.panel.users.view.user.main.miss") }), `updateOrRemoveUserTgId#${ctx.session.user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.name", { name: ctx.session.user.name ?? ctx.t("commands.panel.users.view.user.main.nameless") }), `updateOrRemoveUserName#${ctx.session.user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.username", { username: ctx.session.user.username ?? ctx.t("commands.panel.users.view.user.main.miss") }), `updateOrRemoveUserUsername#${ctx.session.user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.phone", { phone: ctx.session.user.phone ?? ctx.t("commands.panel.users.view.user.main.miss") }), `updateOrRemoveUserPhone#${ctx.session.user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.language", { language: ctx.t(`utils.languages.${ctx.session.user.language}`) }), `updateOrRemoveUserLanguage#${ctx.session.user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.role", { role:  ctx.t(`utils.roles.${ctx.session.user.role}`) }), `updateOrRemoveUserLanguage#${ctx.session.user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.remove"), `removeUser#${ctx.session.user.id}`).style("danger").row()
        .text(ctx.t("utils.shared.back"), "viewUsers");
    ; 
    return { text: format.escapeMarkdown(text), keyboard }
}

function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.panel.users.create.title"),
        ctx.t("commands.panel.users.create.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "viewUsers");
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("commands.panel.users.view.user.remove.path", { userName: ctx.session.user.name })
    ];

    if (result) {
        text.unshift(ctx.t("commands.panel.users.view.user.remove.success"));
        keyboard.text(ctx.t("utils.shared.back"), "viewUsers");
    }
    else {
        text.unshift(ctx.t("commands.panel.users.view.user.remove.error"));
        keyboard.text(ctx.t("utils.shared.back"), `viewUser#${ctx.session.user.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

export default {
    main,
    viewUsers,
    viewUser,
    create,
    remove,
};