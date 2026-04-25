import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { Message } from '@shared/types/Message';
import constants from '@constants';

function main(ctx: MyContext, messages: Message[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const callDistribution = ctx.session.sendout.call;
    const positionId = ctx.session.other.text.positionId;
    const message = messages[positionId];

    const text = [
        ctx.t("commands.cabinet.distribution.messages.view.main.messageNumber", { number: positionId + 1 }) + ' ' +
        ctx.t("commands.cabinet.distribution.messages.view.main.amountMedia", { amount: message!.media?.length!, maxMedia: constants.media.maxMedia }),
        `\`\`\`\n${message?.caption!}\n\`\`\`\n`,
        ctx.t("commands.cabinet.distribution.messages.view.main.path", { call: callDistribution })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.view.main.buttons.updateText"), `updateText:${nameDistribution}#${positionId}`).style("primary")
        .text(ctx.t("utils.shared.buttons.remove"), `removeMessage:${nameDistribution}#${positionId}`).style("danger").row()
        ;

    // Медиа > 0 и != 4
    if (message?.media!.length! > 0 && message?.media!.length! != 4) {
        keyboard
            .text(ctx.t("commands.cabinet.distribution.messages.view.main.buttons.addMedia"), `addMedia:${nameDistribution}#${positionId}`).style("success")
            .text(ctx.t("commands.cabinet.distribution.messages.view.main.buttons.clearAllMedia"), `clearAllMedia:${nameDistribution}#${positionId}`).style("danger").row()
        ;
    }

    // Медиа == 0
    if (message?.media!.length! == 0) {
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.view.main.buttons.addMedia"), `addMedia:${nameDistribution}#${positionId}`).style("success").row();
    }

    // Медиа == 4
    if (message?.media!.length! == 4) {
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.view.main.buttons.clearAllMedia"), `clearAllMedia:${nameDistribution}#${positionId}`).style("danger").row();
    }

    // Навигация по сообщениям
    if (messages.length === 1) {
        keyboard.text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`).row();
    }
    else if (positionId === 0) {
        keyboard
            .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`)
            .text("➡", `viewMessage:${nameDistribution}#${positionId + 1}`).row()
        ;
    }
    else if (positionId + 1 === messages.length) {
        keyboard
            .text("⬅", `viewMessage:${nameDistribution}#${positionId - 1}`)
            .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`).row()
        ;
    }
    else {
        keyboard
            .text("⬅", `viewMessage:${nameDistribution}#${positionId - 1}`)
            .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`)
            .text("➡", `viewMessage:${nameDistribution}#${positionId + 1}`).row()
        ;
    }
    keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

// сообщения
function removeMessage(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.view.text.remove.path", { call: ctx.session.sendout.call })
    ];
    const keyboard = new InlineKeyboard();
    
    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.view.text.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#0`);
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.view.text.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
    }
    
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

// текст
function updateText(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.view.text.update.title"),
        ctx.t("commands.cabinet.distribution.messages.view.text.update.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

// медиа
function addMedia(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.view.media.add.title"),
        ctx.t("commands.cabinet.distribution.messages.view.media.add.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAllMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t("commands.cabinet.distribution.messages.view.media.clearAll.success") :
            ctx.t("commands.cabinet.distribution.messages.view.media.clearAll.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.view.media.clearAll.path", { call: ctx.session.sendout.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function pagination(ctx: MyContext, messagesLength: number) {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.view.pagination.title"),
        ctx.t("commands.cabinet.distribution.messages.view.pagination.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    
    for (let i = 0; i < messagesLength; i++) {
        if (i % 5 == 0) keyboard.row();
        keyboard.text((i + 1).toString(), `viewMessage:${ctx.session.sendout.name}#${i}`);
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
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