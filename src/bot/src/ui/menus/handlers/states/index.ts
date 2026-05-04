import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function addingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingText.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];

    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    }
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingText.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
        }
        else {
            text.unshift(ctx.t("handlers.states.addingText.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function updatingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.updatingText.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);

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
        '\n' + ctx.t("handlers.states.generatingText.pathChoose", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n');
    const keyboard = new InlineKeyboard()
        .text(ctx.t("handlers.states.generatingText.buttons.save"), `generateText:${ctx.session.sendout.id}-true`).style("success")
        .text(ctx.t("handlers.states.generatingText.buttons.cancel"), `generateText:${ctx.session.sendout.id}-false`).style("danger").row()
        .text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.id}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function addingMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}-none`);
    const text = [
        ctx.t("handlers.states.addingMedia.path", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
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

function addingTime(ctx: MyContext, resultRestart: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingTime.path", { call: ctx.session.sendout.call })
    ];
    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);            
    }
    else {
        if (resultRestart) {
            text.unshift(ctx.t("handlers.states.addingTime.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `viewSchedule:${ctx.session.sendout.id}`);
        }
        else {
            text.unshift(ctx.t("handlers.states.addingTime.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);            
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function updatingTime(ctx: MyContext, resultRestart: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.updatingTime.path", { call: ctx.session.sendout.call })
    ];
    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);            
    }
    else {
        if (resultRestart) {
            text.unshift(ctx.t("handlers.states.updatingTime.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `viewSchedule:${ctx.session.sendout.id}`);
        }
        else {
            text.unshift(ctx.t("handlers.states.updatingTime.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);            
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}

function addingUser(ctx: MyContext, result: boolean, validate: boolean) {
    const text = [ ctx.t("handlers.states.addingUser.path") ];
    const keyboard = new InlineKeyboard();

    if (!validate){
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "mainUser");
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
        ctx.t("modules.commands.cabinet.auth.login.path")
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
    addingTime,
    updatingTime,
    addingUser,
    passingAuthorization,
    addingContract
}