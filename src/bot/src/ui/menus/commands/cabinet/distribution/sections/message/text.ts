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
        ctx.t("distribution.sections.messages.text.add.title"),
        ctx.t("distribution.sections.messages.text.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("nav.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("distribution.sections.messages.text.update.title"),
        ctx.t("distribution.sections.messages.text.update.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("nav.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, listText: string[]): Menu<InlineKeyboard> {
    const text = listText.map((t, i) => {
        if (i == listText.length - 1) {
            return ctx.t(t, { call: ctx.session.distribution.call });
        }
        else {
            return ctx.t(t);
        }
    }).join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("nav.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAll(ctx: MyContext, listText: string[]): Menu<InlineKeyboard> {
    const text = listText.map((t, i) => {
        if (i == listText.length - 1) {
            return ctx.t(t, { call: ctx.session.distribution.call });
        }
        else {
            return ctx.t(t);
        }
    }).join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("nav.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    add,
    update,
    remove,
    clearAll
}