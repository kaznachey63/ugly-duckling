import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Результат добавления текста
 */
export default function addingText(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingText.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];

    const keyboard = new InlineKeyboard();

    if (!validate) text.unshift(ctx.t("utils.shared.titles.validate"));
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingText.success"));
            keyboard.text(ctx.t("utils.shared.buttons.create"), `mainCreateText:${ctx.session.sendout.id}`).style("success");
        }
        else {
            text.unshift(ctx.t("handlers.states.addingText.error"));
            keyboard.url(ctx.t("utils.shared.buttons.contactAdmin"), constants.link.tgAdmin);
        }

    }
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}    