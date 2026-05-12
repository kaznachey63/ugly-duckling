import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат обновления текста
 */
export default function updatingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.updatingText.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);

    if (!validate) text.unshift(ctx.t("utils.shared.titles.validate"));
    else {
        if (result) text.unshift(ctx.t("handlers.states.updatingText.success"));
        else text.unshift(ctx.t("handlers.states.updatingText.error"));
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};