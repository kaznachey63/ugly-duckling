import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Результат добавления идеи
 */
export default function addingIdea(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingIdea.path")
    ];

    const keyboard = new InlineKeyboard();

    if (result) {
        text.unshift(ctx.t("handlers.states.addingIdea.success"));
        keyboard.text(ctx.t("modules.commands.settings.idea.main.buttons.add"), "addIdea").style("success");
    }
    else {
        text.unshift(ctx.t("handlers.states.addingIdea.error"));
        keyboard.url(ctx.t("utils.shared.buttons.contactAdmin"), constants.link.tgAdmin);
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "mainIdea");
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
};