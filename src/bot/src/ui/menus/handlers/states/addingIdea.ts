import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат добавления идеи
 */
export default function addingIdea(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t("handlers.states.addingIdea.success") :
            ctx.t("handlers.states.addingIdea.error")
        ,
        ctx.t("handlers.states.addingIdea.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.settings.help.buttons.contactAdmin"), "...")
        .text(ctx.t("utils.shared.buttons.back"), "mainIdea")
        ;
    return { text: format.escapeMarkdown(text), keyboard }
};