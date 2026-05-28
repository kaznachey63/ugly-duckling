import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/DB';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

function viewUsers(ctx: MyContext, users: User[]): Menu<InlineKeyboard> {   
    const text = [
        ctx.t("modules.commands.panel.data.user.view.main.title"),
        ctx.t("modules.commands.panel.data.user.view.main.path"),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    users.forEach((user) => {
        keyboard.text(
            user.name ?? ctx.t("utils.shared.buttons.nameless"),
            `viewUser#${user.id}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainUser");
    return { text: format.escapeMarkdown(text), keyboard }
}

function viewUser(ctx: MyContext, user: User): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.user.view.user.main.title"),
        ctx.t("modules.commands.panel.data.user.view.user.main.path", { userName: user.name ?? ctx.t("utils.shared.buttons.nameless") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.panel.data.user.view.user.main.telegramId", { telegramId: user.telegram_id ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveUserTgId#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.data.user.view.user.main.name", { name: user.name ?? ctx.t("utils.shared.buttons.nameless") }), `updateOrRemoveUserName#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.data.user.view.user.main.username", { username: user.username ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveUserUsername#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.data.user.view.user.main.phone", { phone: user.phone ?? ctx.t("utils.shared.buttons.miss") }), `updateOrRemoveUserPhone#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.data.user.view.user.main.language", { language: ctx.t(`utils.languages.${user.language}`) }), `updateOrRemoveUserLanguage#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.data.user.view.user.main.role", { role:  ctx.t(`utils.roleCodes.${user.role?.code}`) }), `updateOrRemoveUserRole#${user.id}`).row()
        .text(ctx.t("utils.shared.buttons.remove"), `removeUser#${user.id}`).style("danger").row()
        .text(ctx.t("utils.shared.buttons.back"), "viewUsers");
    ; 
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    viewUsers,
    viewUser,
};