import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.text.add.title"),
        ctx.t("commands.cabinet.distribution.messages.text.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage#${ctx.session.distribution.name}:0`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.text.update.title"),
        ctx.t("commands.cabinet.distribution.messages.text.update.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage#${ctx.session.distribution.name}:${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.text.remove.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard();

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.text.remove.success"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#0`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.text.remove.error"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function clearAll(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t("commands.cabinet.distribution.messages.text.clearAll.success") :
            ctx.t("commands.cabinet.distribution.messages.text.clearAll.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.text.clearAll.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage#${ctx.session.distribution.name}:0`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function adding(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.text.adding.path", { call: ctx.session.distribution.call })
    ];

    const keyboard = new InlineKeyboard();
    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.text.adding.success"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId + 1}`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.text.adding.error"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#0`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function updating(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.text.updating.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard();

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.text.updating.success"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.text.updating.error"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

export default {
    add,
    update,
    remove,
    clearAll,
    adding,
    updating
}