import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@constants';

// Отображение сообщения
function main(ctx: MyContext, messagesLength: number): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const callDistribution = ctx.session.sendout.call;
    const message = ctx.session.message;

    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.main.messageNumber", { number: message.position! }) + ' ' +
        ctx.t("modules.shared.sendout.view.sendout.message.view.main.amountMedia", { amount: message!.media?.length!, maxMedia: constants.media.maxMedia }),
        `\`\`\`\n${message?.caption!}\n\`\`\`\n`,
        ctx.t("modules.shared.sendout.view.sendout.message.view.main.path", { call: callDistribution, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.updateText"), `updateText:${sendoutId}#${message.id!}`).style("primary")
        .text(ctx.t("utils.shared.buttons.remove"), `removeMessage:${sendoutId}#${message.id!}`).style("danger").row();

    if (message?.media!.length! > 0 && message?.media!.length! != 4) {
        keyboard
            .text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.addMedia"), `addMedia:${sendoutId}#${message.id!}`).style("success")
            .text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.clearAllMedia"), `clearAllMedia:${sendoutId}#${message.id!}`).style("danger").row();
    }

    if (message?.media!.length! == 0) {
        keyboard.text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.addMedia"), `addMedia:${sendoutId}#${message.id!}`).style("success").row();
    }

    if (message?.media!.length! == 4) {
        keyboard.text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.clearAllMedia"), `clearAllMedia:${sendoutId}#${message.id!}`).style("danger").row();
    }

    if (messagesLength === 1) {
        keyboard.text(`${message.position!} / ${messagesLength}`, `paginationMessages:${sendoutId}#${message.position!}/${messagesLength}`).row();
    }
    else if (message.position! === 1) {
        keyboard
            .text(`${message.position!} / ${messagesLength}`, `paginationMessages:${sendoutId}#${message.position!}/${messagesLength}`)
            .text("➡", `viewMessage:${sendoutId}#${message.position! + 1}-next`).row();
    }
    else if (message.position! === messagesLength) {
        keyboard
            .text("⬅", `viewMessage:${sendoutId}#${message.position! - 1}-prev`)
            .text(`${message.position!} / ${messagesLength}`, `paginationMessages:${sendoutId}#${message.position!}/${messagesLength}`).row();
    }
    else {
        keyboard
            .text("⬅", `viewMessage:${sendoutId}#${message.position! - 1}-prev`)
            .text(`${message.position!} / ${messagesLength}`, `paginationMessages:${sendoutId}#${message.position!}/${messagesLength}`)
            .text("➡", `viewMessage:${sendoutId}#${message.position! + 1}-next`).row();
    }

    keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    return { text: format.escapeMarkdown(text), keyboard };
}

// сообщения
function removeMessage(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.text.remove.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];
    const keyboard = new InlineKeyboard();
    
    if (result) {
        text.unshift(ctx.t("modules.shared.sendout.view.sendout.message.view.text.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#0`);
    }
    else {
        text.unshift(ctx.t("modules.shared.sendout.view.sendout.message.view.text.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    }
    
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

// текст
function updateText(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.text.update.title"),
        ctx.t("modules.shared.sendout.view.sendout.message.view.text.update.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

// медиа
function addMedia(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.media.add.title"),
        ctx.t("modules.shared.sendout.view.sendout.message.view.media.add.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAllMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t("modules.shared.sendout.view.sendout.message.view.media.clearAll.success") :
            ctx.t("modules.shared.sendout.view.sendout.message.view.media.clearAll.error")
        ,
        ctx.t("modules.shared.sendout.view.sendout.message.view.media.clearAll.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function pagination(ctx: MyContext, messagesLength: number) {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.pagination.title"),
        ctx.t("modules.shared.sendout.view.sendout.message.view.pagination.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    
    for (let i = 0; i < messagesLength; i++) {
        if (i % 5 == 0) keyboard.row();
        keyboard.text((i + 1).toString(), `viewMessage:${ctx.session.sendout.id}#${i}`);
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }    
}

export default {
    main,
    removeMessage,
    updateText,
    addMedia,
    clearAllMedia,
    pagination
}