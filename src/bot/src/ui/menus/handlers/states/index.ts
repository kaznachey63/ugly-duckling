import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function addingText(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.states.addingText.path", { call: ctx.session.distribution.call })
    ];

    const keyboard = new InlineKeyboard();
    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.states.addingText.success"));
        keyboard.text(ctx.t("utils.shared.back"), `viewMessage:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.states.addingText.error"));
        keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function updatingText(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.states.updatingText.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `viewMessage:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}`);

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.states.updatingText.success"));
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.states.updatingText.error"));
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function generatingText(ctx: MyContext, result: string) {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.states.generatingText.result") + '\n',
        result,
        '\n' + ctx.t("commands.cabinet.distribution.messages.states.generatingText.pathChoose", { call: ctx.session.distribution.call }),
    ].join('\n');
    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.states.generatingText.buttons.save"), `generateText:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}-true`).style("success")
        .text(ctx.t("commands.cabinet.distribution.messages.states.generatingText.buttons.cancel"), `generateText:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}-false`).style("danger").row()
        .text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `viewMessage:${ctx.session.distribution.name}#${ctx.session.other.text.positionId}`);;
    const text = [
        ctx.t("commands.cabinet.distribution.messages.states.addingMedia.path", { call: ctx.session.distribution.call })
    ];

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.states.addingMedia.success"));
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.states.addingMedia.error2"));
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
        ctx.t("commands.cabinet.distribution.schedule.states.addingTime.path", { call: ctx.session.distribution.call })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.call}`);

    if (!validate) {
        text.unshift(ctx.t("commands.cabinet.distribution.schedule.states.addingTime.validate"));
    }
    else {
        if (resultRestart) {
            text.unshift(ctx.t("commands.cabinet.distribution.schedule.states.addingTime.success"));
        }
        else {
            text.unshift(ctx.t("commands.cabinet.distribution.schedule.states.addingTime.error"));
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