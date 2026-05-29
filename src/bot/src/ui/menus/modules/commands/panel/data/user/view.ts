import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/DB';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';
import { CryptoService } from '@common/services/CryptoService';
import constants from '@common/constants';
import localization from '@utils/localization';

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

function viewUser(ctx: MyContext): Menu<InlineKeyboard> {
    const user = ctx.session.userForUpdate;
    const text = [
        ctx.t("modules.commands.panel.data.user.view.control.main.title"),
        ctx.t("modules.commands.panel.data.user.view.control.main.path", { userName: user.name ?? ctx.t("utils.shared.buttons.nameless") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.panel.data.user.view.control.main.telegramId", { telegramId: ctx.t("utils.shared.buttons.miss") }), '#').row()
        .text(ctx.t("modules.commands.panel.data.user.view.control.main.name", { name: user.name ?? ctx.t("utils.shared.buttons.nameless") }), `updateUserName#${user.id}`).row()
        .text(ctx.t("modules.commands.panel.data.user.view.control.main.username", { username: user.username ?? ctx.t("utils.shared.buttons.miss") }), '#').row()
        .text(ctx.t("modules.commands.panel.data.user.view.control.main.phone", { phone: CryptoService.decrypt(user.phone!) }), `updateUserPhone#${user.id}`).row()
        // @ts-ignore
        .text(ctx.t("modules.commands.panel.data.user.view.control.main.language", { language: localization.getContryFlagOfCode(user.language) }), '#').row()
        .text(ctx.t("modules.commands.panel.data.user.view.control.main.role", { role:  ctx.t(`utils.roleCodes.${user.role?.code}`) }), `updateUserRole#${user.id}`).row()    
    ; 
    
    if (user.telegram_id) keyboard.url(constants.emoji.profile, constants.link.profileById + user.telegram_id);
    else keyboard.url(constants.emoji.profile, constants.link.chatByNumber + CryptoService.decrypt(user.phone!));

    keyboard
        .text(ctx.t("utils.shared.buttons.remove"), `removeUser#${user.id}`).style("danger")
        .row().text(ctx.t("utils.shared.buttons.back"), "viewUsers")
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    viewUsers,
    viewUser,
};