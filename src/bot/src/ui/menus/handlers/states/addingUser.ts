import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат добавления пользователя
 */
export default function addingUser(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [ ctx.t("handlers.states.addingUser.path") ];
    const keyboard = new InlineKeyboard();

    if (!validate){
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "mainUser");
    } 
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingUser.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
        }
        else {
            text.unshift(ctx.t("handlers.states.addingUser.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewUsers");
        }
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};