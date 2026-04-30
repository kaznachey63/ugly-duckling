import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function addingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingText.path", { call: ctx.session.sendout.call })
    ];

    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
    }
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingText.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
        }
        else {
            text.unshift(ctx.t("handlers.states.addingText.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function updatingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.updatingText.path", { call: ctx.session.sendout.call })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);

    if (!validate) text.unshift(ctx.t("utils.shared.titles.validate"));
    else {
        if (result) text.unshift(ctx.t("handlers.states.updatingText.success"));
        else text.unshift(ctx.t("handlers.states.updatingText.error"));
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function generatingText(ctx: MyContext, result: string) {
    const text = [
        ctx.t("handlers.states.generatingText.result") + '\n',
        result,
        '\n' + ctx.t("handlers.states.generatingText.pathChoose", { call: ctx.session.sendout.call }),
    ].join('\n');
    const keyboard = new InlineKeyboard()
        .text(ctx.t("handlers.states.generatingText.buttons.save"), `generateText:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}-true`).style("success")
        .text(ctx.t("handlers.states.generatingText.buttons.cancel"), `generateText:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}-false`).style("danger").row()
        .text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);;
    const text = [
        ctx.t("handlers.states.addingMedia.path", { call: ctx.session.sendout.call })
    ];

    if (result) text.unshift(ctx.t("handlers.states.addingMedia.success"));
    else text.unshift(ctx.t("handlers.states.addingMedia.error2"));

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function addingIdea(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t("handlers.states.addingIdea.success") :
            ctx.t("handlers.states.addingIdea.error")
        ,
        ctx.t("handlers.states.addingIdea.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainIdea");
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingOrUpdateTime(ctx: MyContext, resultRestart: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingOrUpdateTime.path", { call: ctx.session.sendout.call })
    ];
    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.name}`);            
    }
    else {
        if (resultRestart) {
            text.unshift(ctx.t("handlers.states.addingOrUpdateTime.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `viewSchedule:${ctx.session.sendout.name}`);
        }
        else {
            text.unshift(ctx.t("handlers.states.addingOrUpdateTime.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.name}`);            
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function addingUser(ctx: MyContext, result: boolean, validate: boolean) {
    const text = [ ctx.t("handlers.states.addingUser.path") ];
    const keyboard = new InlineKeyboard();

    if (!validate){
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "mainUsers");
    } 
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingUser.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
        }
        else {
            text.unshift(ctx.t("handlers.states.addingUser.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
        }
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function passingAuthorization(ctx: MyContext) {
    const text = [
        ctx.t("modules.commands.cabinet.auth.login.canceled"),
        ctx.t("modules.commands.cabinet.auth.login.path", { result: ctx.t("modules.commands.cabinet.auth.login.cancel")})
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainCabinet");
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingContract(ctx: MyContext, result: boolean, validate: boolean) {
    const text = [ ctx.t("handlers.states.addingContract.path") ];
    const keyboard = new InlineKeyboard();

    if (!validate){
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "mainContract");
    } 
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingContract.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
        }
        else {
            text.unshift(ctx.t("handlers.states.addingContract.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
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
    addingOrUpdateTime,
    addingUser,
    passingAuthorization,
    addingContract
}