import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Time } from '@shared/types/Time';
import utils from '@utils';
import format from '@utils/formatting';
import type { Message } from '@shared/types/Message';
import type { Status } from '@shared/types/server/Status';

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t(commands.cabinet.distribution.messages.media.add.title"),
        ctx.t(commands.cabinet.distribution.messages.media.add.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
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
        .text(ctx.t("utils.shared.back"), `mainMessage${ctx.session.distribution.name}`)
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function adding(ctx: MyContext, status: Status): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "mainMessage");

    const text = [
        status === 'active'
            ? ctx.t('states.media.add.success')
            : ctx.t('states.media.add.error2'),

        ctx.t('states.media.add.path', {
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