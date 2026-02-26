import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Status } from '@shared/types/server/Status';
import format from '@utils/formatting';

/**
 * Меню после добавления медиа
 */
function add(ctx: MyContext, status: Status): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("nav.back"), "mainMessage");

    const text = [
        status === 'active'
            ? ctx.t('states.media.add.success')
            : ctx.t('states.media.add.error2'),

        ctx.t('states.media.add.path', {
            call: ctx.session.distribution.call
        })
    ].join('\n\n');

    return { text:  format.escapeMarkdown(text), keyboard };
}

export default {
    add
}