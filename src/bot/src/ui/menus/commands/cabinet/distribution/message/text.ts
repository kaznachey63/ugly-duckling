import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Time } from '@shared/types/Time';
import utils from '@utils';
import format from '@utils/formatting';
import type { Message } from '@shared/types/Message';
import type { IMessage } from '@shared/types/IMessage';

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t(commands.cabinet.distribution.messages.text.add.title"),
        ctx.t(commands.cabinet.distribution.messages.text.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t(commands.cabinet.distribution.messages.text.update.title"),
        ctx.t(commands.cabinet.distribution.messages.text.update.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t(commands.cabinet.distribution.messages.text.remove.success") :
            ctx.t(commands.cabinet.distribution.messages.text.remove.error")
        ,
        ctx.t(commands.cabinet.distribution.messages.text.remove.path", { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAll(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t(commands.cabinet.distribution.messages.text.clearAll.success") :
            ctx.t(commands.cabinet.distribution.messages.text.clearAll.error")
        ,
        ctx.t(commands.cabinet.distribution.messages.text.clearAll.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
        ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function adding(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t(commands.cabinet.distribution.messages.text.adding.success") :
            ctx.t(commands.cabinet.distribution.messages.text.adding.error")
        ,
        ctx.t(commands.cabinet.distribution.messages.text.adding.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
        ;
    return { text: format.escapeMarkdown(text), keyboard };
}

function updating(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t(commands.cabinet.distribution.messages.text.updating.success") :
            ctx.t(commands.cabinet.distribution.messages.text.updating.error")
        ,
        ctx.t(commands.cabinet.distribution.messages.text.updating.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
        ;
    return { text: format.escapeMarkdown(text), keyboard };
}

export default {
    add,
    update,
    remove,
    clearAll,
    adding,
    updating
}