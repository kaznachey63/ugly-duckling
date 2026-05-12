import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/DB';
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

function remove(ctx: MyContext, user: User, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.commands.panel.data.user.view.user.remove.path", { userName: user.name ?? ctx.t("utils.shared.buttons.nameless") }),
    ];

    if (result) {
        text.unshift(ctx.t("modules.commands.panel.data.user.view.user.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
    }
    else {
        text.unshift(ctx.t("modules.commands.panel.data.user.view.user.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewUser#${user.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

export default {
    create,
    remove,
};