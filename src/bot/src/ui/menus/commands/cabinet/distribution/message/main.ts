import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { IMessage } from '@shared/types/IMessage';
import constants from '@constants';

function main(ctx: MyContext, messages: IMessage[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    const positionId = ctx.session.state.text.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.add"), `mainAddText:${nameDistribution}#${positionId}`).style("success")
        // .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `addMessage:${nameDistribution}`).style("success").row()
    ;

    // Нет сообщений
    if (!messages?.length) {
        text.push(ctx.t("commands.cabinet.distribution.messages.main.noMessages", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("commands.cabinet.distribution.messages.main.title", { amount: positionId }));
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllMessages:${nameDistribution}`).style("danger").row()
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.read"), `readMessage:${nameDistribution}#0`).style("primary")
    }
    keyboard.row().text(ctx.t("utils.shared.back"), `mainDistribution:${ctx.session.distribution.name}`);
    text.push(ctx.t("commands.cabinet.distribution.messages.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    const positionId = ctx.session.state.text.positionId;   

    const text = [
        ctx.t("commands.cabinet.distribution.messages.add.main.title", { call: callDistribution }),
        ctx.t("commands.cabinet.distribution.messages.add.main.path", { call: callDistribution }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        // .text(ctx.t("commands.cabinet.distribution.messages.add.main.buttons.generate"), `generateText:${nameDistribution}#${positionId}`).style("success")
        .text(ctx.t("commands.cabinet.distribution.messages.add.main.buttons.hand"), `handInputText:${nameDistribution}#${positionId}`).row()
        .text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAll(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t("commands.cabinet.distribution.messages.clearAll.success") :
            ctx.t("commands.cabinet.distribution.messages.clearAll.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.clearAll.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function read(ctx: MyContext, messages: IMessage[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    const positionId = ctx.session.state.text.positionId;
    const message = messages[positionId];

    const text = [
        ctx.t("commands.cabinet.distribution.messages.read.main.messageNumb", { number: positionId + 1 }) + ' ' +
        ctx.t("commands.cabinet.distribution.messages.read.main.amountMedia", { amount: message!.media?.length!, maxMedia: constants.maxMedia }),
        `\`\`\`\n${message?.caption!}\n\`\`\`\n`,
        ctx.t("commands.cabinet.distribution.messages.read.main.path", { call: callDistribution })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.read.main.buttons.updateText"), `updateText:${nameDistribution}#${positionId}`).style("primary")
        .text(ctx.t("commands.cabinet.distribution.messages.read.main.buttons.removeMessage"), `removeMessage:${nameDistribution}#${positionId}`).style("danger").row()
    ;

    // Медиа > 0 и != 4
    if (message?.media!.length! > 0 && message?.media!.length! != 4) {
        keyboard
            .text(ctx.t("commands.cabinet.distribution.messages.read.main.buttons.addMedia"), `addMedia:${nameDistribution}#${positionId}`).style("success")
            .text(ctx.t("commands.cabinet.distribution.messages.read.main.buttons.clearAllMedia"), `clearAllMedia:${nameDistribution}#${positionId}`).style("danger").row()
        ;
    }

    // Медиа == 0
    if (message?.media!.length! == 0) {
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.read.main.buttons.addMedia"), `addMedia:${nameDistribution}#${positionId}`).style("success").row();
    }

    // Медиа == 4
    if (message?.media!.length! == 4) {
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.read.main.buttons.clearAllMedia"), `clearAllMedia:${nameDistribution}#${positionId}`).style("danger").row();
    }

    // Навигация по сообщениям
    if (messages.length === 1) {
        keyboard.text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`).row();
    }
    else if (positionId === 0) {
        keyboard
            .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`)
            .text("➡", `readMessage:${nameDistribution}#${positionId + 1}`).row()
        ;
    }
    else if (positionId + 1 === messages.length) {
        keyboard
            .text("⬅", `readMessage:${nameDistribution}#${positionId - 1}`)
            .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`).row()
        ;
    }
    else {
        keyboard
            .text("⬅", `readMessage:${nameDistribution}#${positionId - 1}`)
            .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`)
            .text("➡", `readMessage:${nameDistribution}#${positionId + 1}`).row()
        ;
    }
    keyboard.text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    add,
    clearAll,
    read
}