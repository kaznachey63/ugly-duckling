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

function viewUser(ctx: MyContext, user: User): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.panel.users.view.user.main.title"),
        ctx.t("commands.panel.users.view.user.main.path", { userName: user.name ?? ctx.t("commands.panel.users.view.user.main.nameless") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.panel.users.view.user.main.telegramId", { telegramId: user.telegramId ?? ctx.t("commands.panel.users.view.user.main.miss") }), `updateOrRemoveUserTgId#${user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.name", { name: user.name ?? ctx.t("commands.panel.users.view.user.main.nameless") }), `updateOrRemoveUserName#${user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.username", { username: user.username ?? ctx.t("commands.panel.users.view.user.main.miss") }), `updateOrRemoveUserUsername#${user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.phone", { phone: user.phone ?? ctx.t("commands.panel.users.view.user.main.miss") }), `updateOrRemoveUserPhone#${user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.language", { language: ctx.t(`utils.languages.${user.language}`) }), `updateOrRemoveUserLanguage#${user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.role", { role:  ctx.t(`utils.roles.${user.role}`) }), `updateOrRemoveUserLanguage#${user.id}`).row()
        .text(ctx.t("commands.panel.users.view.user.main.remove"), `removeUser#${user.id}`).style("danger").row()
        .text(ctx.t("utils.shared.back"), "viewUsers");
    ; 
    return { text: format.escapeMarkdown(text), keyboard }
}

function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.panel.users.create.title"),
        ctx.t("commands.panel.users.create.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "viewUsers");
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, user: User, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("commands.panel.users.view.user.remove.path", { userName: user.name })
    ];

    if (result) {
        text.unshift(ctx.t("commands.panel.users.view.user.remove.success"));
        keyboard.text(ctx.t("utils.shared.back"), "viewUsers");
    }
    else {
        text.unshift(ctx.t("commands.panel.users.view.user.remove.error"));
        keyboard.text(ctx.t("utils.shared.back"), `viewUser#${user.id}`);
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