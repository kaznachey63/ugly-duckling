import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function addingText(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.text.adding.path", { call: ctx.session.distribution.call })
    ];

    const keyboard = new InlineKeyboard();
    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.read.text.adding.success"));
        keyboard.text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}`);
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
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}`);

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
        .text(ctx.t("commands.cabinet.distribution.messages.add.generate.buttons.save"), `generateText:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}-true`).style("success")
        .text(ctx.t("commands.cabinet.distribution.messages.add.generate.buttons.cancel"), `generateText:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}-false`).style("danger").row()
        .text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}`);;
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

function addingIdea(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t('commands.settings.idea.adding.success') :
            ctx.t('commands.settings.idea.adding.error')
        ,
        ctx.t('commands.settings.idea.adding.path')
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "mainIdea");
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingTime(ctx: MyContext, resultRestart: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.time.adding.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.call}`);

    if (!validate) {
        text.unshift(ctx.t("commands.cabinet.distribution.schedule.time.adding.validate"));
    }
    else {
        if (resultRestart) {
            text.unshift(ctx.t("commands.cabinet.distribution.schedule.time.adding.success"));
        }
        else {
            text.unshift(ctx.t("commands.cabinet.distribution.schedule.time.adding.error"));
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

export default {
    addingText,
    updatingText,
    generatingText,
    addingMedia,
    addingIdea,
    addingTime
}