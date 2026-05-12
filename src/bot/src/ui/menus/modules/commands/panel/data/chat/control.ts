import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

function reupload(ctx: MyContext, success: boolean): Menu<InlineKeyboard> {
    const text = [
        success ?
            ctx.t("modules.commands.panel.data.chat.reupload.success") :
            ctx.t("modules.commands.panel.data.chat.reupload.error")
        ,
        ctx.t("modules.commands.panel.data.chat.reupload.path", { call: ctx.session.sendout.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainChat");
    return { text: format.escapeMarkdown(text), keyboard }
}

function clear(ctx: MyContext, amountOfChats: number): Menu<InlineKeyboard> {
    const text = [
        amountOfChats == 0 ?
            ctx.t("modules.commands.panel.data.chat.clear.success") :
            ctx.t("modules.commands.panel.data.chat.clear.error")
        ,
        ctx.t("modules.commands.panel.data.chat.clear.path", { call: ctx.session.sendout.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainChat");
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    reupload,
    clear
};