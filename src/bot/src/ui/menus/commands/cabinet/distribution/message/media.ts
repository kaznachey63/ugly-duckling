import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.media.add.title"),
        ctx.t("commands.cabinet.distribution.messages.media.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
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
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function adding(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);;
    const text = [
        ctx.t("commands.cabinet.distribution.messages.media.adding.path", { call: ctx.session.distribution.call })
    ];

    if (result) {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.media.adding.success"));
    }
    else {
        text.unshift(ctx.t("commands.cabinet.distribution.messages.media.adding.error2"));
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}
export default {
    add,
    clearAll,
    adding
}