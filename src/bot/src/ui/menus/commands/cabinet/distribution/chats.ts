import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Chat } from "@shared/types/Chat";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Меню раздела чаты
 */
function main(ctx: MyContext, amountOfChats: number): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.chats.main.title"),
        ctx.t("commands.cabinet.distribution.chats.main.path", { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard();
    
    if (amountOfChats > 0) {
        keyboard.text(ctx.t("commands.cabinet.distribution.chats.main.buttons.clear"), "clearChats").style("danger");
    }
    
    keyboard
        .text(ctx.t("commands.cabinet.distribution.chats.main.buttons.reupload"), "reuploadChats").style("success").row()
        .text(ctx.t("utils.shared.back"), `mainDistribution${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function reupload(ctx: MyContext, success: boolean): Menu<InlineKeyboard> {
    const text = [
        success ?
            ctx.t("commands.cabinet.distribution.chats.reupload.success") :
            ctx.t("commands.cabinet.distribution.chats.reupload.error")
        ,
        ctx.t("commands.cabinet.distribution.chats.reupload.path", { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "mainChats");
    return { text: format.escapeMarkdown(text), keyboard }
}

function clear(ctx: MyContext, amountOfChats: number): Menu<InlineKeyboard> {
    const text = [
        amountOfChats == 0 ?
            ctx.t("commands.cabinet.distribution.chats.clear.success") :
            ctx.t("commands.cabinet.distribution.chats.clear.error")
        ,
        ctx.t("commands.cabinet.distribution.chats.clear.path", { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "mainChats");
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    reupload,
    clear
};

// export default function chat(ctx: MyContext, success: number, chats: Chat[]): Menu<InlineKeyboard> {
//     const text = [
//         ctx.t("commands.cabinet.distribution.chats.amount", { success: success }),
//         ctx.t("commands.cabinet.distribution.chats.path", { call: ctx.session.distribution.call })
//     ].join('\n\n');
    
//     const keyboard = new InlineKeyboard();
//     chats.forEach((chat: Chat) => {
//         keyboard.url(
//             chat.title,
//             chat.link
//         ).row();
//     });
//     keyboard.text(ctx.t("utils.shared.back"), "mainDistribution");
//     return { text, keyboard }
// }