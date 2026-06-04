
import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Меню результата смены позывного рассылки
 */
export default function updatingSendoutCall(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("handlers.states.updatingSendoutCall.path", { call: ctx.session.sendout.call }),
    ];

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainSendoutNames:${ctx.session.sendout.id}`);

    if (!validate) text.unshift(ctx.t("utils.shared.titles.validate"));
    else {
        if (result) text.unshift(ctx.t("handlers.states.updatingSendoutCall.success"));
        else text.unshift(ctx.t("handlers.states.updatingSendoutCall.error"));
    }

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
};