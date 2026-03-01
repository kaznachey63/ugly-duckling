import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { Status } from '@shared/types/server/Status';

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.media.add.title"),
        ctx.t("commands.cabinet.distribution.messages.media.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAll(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t("commands.cabinet.distribution.messages.media.clearAll.success") :
            ctx.t("commands.cabinet.distribution.messages.media.clearAll.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.media.clearAll.path", { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function adding(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}:0`);

    const text = [
            result ? ctx.t("commands.cabinet.distribution.messages.media.adding.success")
            : ctx.t("commands.cabinet.distribution.messages.media.adding.error2"),

        ctx.t("commands.cabinet.distribution.messages.media.adding.path", {
            call: ctx.session.distribution.call
        })
    ].join('\n\n');

    return { text: format.escapeMarkdown(text), keyboard };
}
export default {
    add,
    clearAll,
    adding
}