import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function removeMessage(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.text.remove.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard();
    
    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.remove.success"));
        keyboard.text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#0`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.remove.error"));
        keyboard.text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    }
    
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function updateText(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.text.update.title"),
        ctx.t("commands.cabinet.distribution.messages.read.text.update.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingText(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.text.adding.path", { call: ctx.session.distribution.call })
    ];

    const keyboard = new InlineKeyboard();
    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.adding.success"));
        keyboard.text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.adding.error"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function updatingText(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.text.updating.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.updating.success"));
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.updating.error"));
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function generatingText(ctx: MyContext, result: string) {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.add.generate.result") + '\n',
        result,
        '\n' + ctx.t("commands.cabinet.distribution.messages.add.generate.pathChoose", { call: ctx.session.distribution.call }),
    ].join('\n');
    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.add.generate.buttons.ok"), `generatingText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}-true`).style("success")
        .text(ctx.t("commands.cabinet.distribution.messages.add.generate.buttons.cancel"), `generatingText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}-false`).style("danger").row()
        .text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

// медиа
function addMedia(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.media.add.title"),
        ctx.t("commands.cabinet.distribution.messages.read.media.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAllMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t("commands.cabinet.distribution.messages.read.media.clearAll.success") :
            ctx.t("commands.cabinet.distribution.messages.read.media.clearAll.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.read.media.clearAll.path", { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);;
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.media.adding.path", { call: ctx.session.distribution.call })
    ];

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.media.adding.success"));
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.media.adding.error2"));
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

export default {
    removeMessage,
    updateText,
    addingText,
    updatingText,
    generatingText,
    addMedia,
    clearAllMedia,
    addingMedia,
}