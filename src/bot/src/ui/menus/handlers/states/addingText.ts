import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат добавления текста
 */
export default function addingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingText.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];

    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    }
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingText.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
        }
        else {
            text.unshift(ctx.t("handlers.states.addingText.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};