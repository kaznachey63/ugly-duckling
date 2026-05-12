import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат генерации текста
 */
export default function generatingText(ctx: MyContext, result: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.generatingText.result") + '\n',
        result,
        '\n' + ctx.t("handlers.states.generatingText.pathChoose", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n');
    const keyboard = new InlineKeyboard()
        .text(ctx.t("handlers.states.generatingText.buttons.save"), `generateText:${ctx.session.sendout.id}-true`).style("success")
        .text(ctx.t("handlers.states.generatingText.buttons.cancel"), `generateText:${ctx.session.sendout.id}-false`).style("danger").row()
        .text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.id}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
};