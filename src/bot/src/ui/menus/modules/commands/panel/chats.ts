import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела чаты
 */
function main(ctx: MyContext, amountOfChats: number): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.chats.main.title"),
        ctx.t("modules.commands.panel.chats.main.amount", { amount: amountOfChats }),
        "",
        ctx.t("modules.commands.panel.chats.main.path")
    ].join('\n');
    
    const keyboard = new InlineKeyboard();
    
    if (amountOfChats > 0) {
        keyboard.text(ctx.t("utils.shared.buttons.clear"), "clearChats").style("danger");
    }
    
    keyboard
        .text(ctx.t("modules.commands.panel.chats.main.buttons.reupload"), "reuploadChats").style("success").row()
        .text(ctx.t("utils.shared.buttons.back"), "mainPanel")
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function reupload(ctx: MyContext, success: boolean): Menu<InlineKeyboard> {
    const text = [
        success ?
            ctx.t("modules.commands.panel.chats.reupload.success") :
            ctx.t("modules.commands.panel.chats.reupload.error")
        ,
        ctx.t("modules.commands.panel.chats.reupload.path", { call: ctx.session.sendout.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainChats");
    return { text: format.escapeMarkdown(text), keyboard }
}

function clear(ctx: MyContext, amountOfChats: number): Menu<InlineKeyboard> {
    const text = [
        amountOfChats == 0 ?
            ctx.t("modules.commands.panel.chats.clear.success") :
            ctx.t("modules.commands.panel.chats.clear.error")
        ,
        ctx.t("modules.commands.panel.chats.clear.path", { call: ctx.session.sendout.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainChats");
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    reupload,
    clear
};