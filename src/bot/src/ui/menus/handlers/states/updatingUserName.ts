import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат обновления имени пользователя
 */
export default function menuUpdatingUserName(ctx: MyContext, validate: boolean, result?: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.updatingUserName.path", { userName: ctx.session.userForUpdate.name })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewUser$${ctx.session.userForUpdate.id}`);

    if (!validate) text.unshift(ctx.t("utils.shared.titles.validate"));
    else {
        if (result) text.unshift(ctx.t("handlers.states.updatingUserName.success"));
        else text.unshift(ctx.t("handlers.states.updatingUserName.error"));
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};