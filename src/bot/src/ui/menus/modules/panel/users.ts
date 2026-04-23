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
            user.name ?? ctx.t(`utils.roles.unknown`),
            `viewUser#${user.telegramId}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.back"), "mainUsers");
    return { text: format.escapeMarkdown(text), keyboard }
}

function viewUser(ctx: MyContext, user: User): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.panel.users.view.user.title"),
        ctx.t("commands.panel.users.view.user.path", { userName: user.name }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.panel.users.view.user.id", { id: user.telegramId }), `updateOrRemoveUserTgId#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.name", { name: user.name }), `updateOrRemoveUserName#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.username", { username: user.username }), `updateOrRemoveUserUsername#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.phone", { phone: user.phone }), `updateOrRemoveUserPhone#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.language", { language: ctx.t(`utils.languages.${user.language}`) }), `updateOrRemoveUserLanguage#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.role", { role:  ctx.t(`utils.roles.${user.role}`) }), `updateOrRemoveUserLanguage#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.remove"), `removeUser#${user.telegramId}`).style("danger").row()
        .text(ctx.t("utils.shared.back"), "mainUsers");
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

export default {
    main,
    viewUsers,
    viewUser,
    create,
};