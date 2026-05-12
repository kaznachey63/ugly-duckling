import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат добавления договора
 */
export default function addingContract(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [ ctx.t("handlers.states.addingContract.path") ];
    const keyboard = new InlineKeyboard();

    if (!validate){
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "mainContract");
    } 
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingContract.success"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
        }
        else {
            text.unshift(ctx.t("handlers.states.addingContract.error"));
            keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
        }
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};