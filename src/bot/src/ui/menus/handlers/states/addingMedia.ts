import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат добавления медиац
 */
export default function addingMedia(ctx: MyContext, validate: boolean, result?: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}-none`);
    const text = [
        ctx.t("handlers.states.addingMedia.path", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];

    if (!validate) text.unshift(ctx.t("utils.shared.titles"));
    else {
        if (result) text.unshift(ctx.t("handlers.states.addingMedia.success"));
        else text.unshift(ctx.t("handlers.states.addingMedia.error"));
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};