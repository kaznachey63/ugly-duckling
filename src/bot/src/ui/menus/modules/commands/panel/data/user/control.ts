import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.user.create.title"),
        ctx.t("modules.commands.panel.data.user.create.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainUser");
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const user = ctx.session.userForUpdate;
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.commands.panel.data.user.view.control.remove.path", { userName: user.name ?? ctx.t("utils.shared.buttons.nameless") }),
    ];

    if (result) {
        text.unshift(ctx.t("modules.commands.panel.data.user.view.control.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
    }
    else {
        text.unshift(ctx.t("modules.commands.panel.data.user.view.control.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewUser#${user.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function updateName(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.user.view.control.update.name.title"),
        ctx.t("modules.commands.panel.data.user.view.control.update.name.path", { userName: ctx.session.userForUpdate.name ?? ctx.t("utils.shared.buttons.nameless")})
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewUser#${ctx.session.userForUpdate.id}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function updatePhone(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.user.view.control.update.phone.title"),
        ctx.t("modules.commands.panel.data.user.view.control.update.phone.path", { userName: ctx.session.userForUpdate.name ?? ctx.t("utils.shared.buttons.nameless") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewUser#${ctx.session.userForUpdate.id}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    create,
    remove,
    updateName,
    updatePhone,
};