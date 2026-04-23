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
    console.log(users);
    
    const text = [
        ctx.t("commands.panel.users.view.users.title"),
        ctx.t("commands.panel.users.view.users.path"),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

users.forEach((user) => {
    const id = user.telegramId;
    if (!id) {
        console.error('User without telegramId:', user);
        return; // пропускаем этого пользователя
    }
    keyboard.text(
        user.name ?? "Безымянный",
        `viewUser#${id}`
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
        .text(ctx.t("commands.panel.users.view.user.title"), "").row()
        .text(ctx.t("commands.panel.users.view.user.id", { id: user.telegramId }), `updateOrRemoveUserTgId#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.name", { name: user.name }), `updateOrRemoveUserName#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.username", { username: user.username }), `updateOrRemoveUserUsername#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.phone", { phone: user.phone }), `updateOrRemoveUserPhone#${user.telegramId}`).row()
        .text(ctx.t("commands.panel.users.view.user.language", { language: user.language }), `updateOrRemoveUserLanguage#${user.telegramId}`).row()
        .text(ctx.t("utils.shared.back"), "mainUsers");
    ; 
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    viewUsers,
    viewUser,
};