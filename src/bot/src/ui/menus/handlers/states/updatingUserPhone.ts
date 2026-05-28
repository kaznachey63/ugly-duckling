import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

/**
 * Результат обновления номера пользователя
 */
export default function menuUpdatingUserPhone(ctx: MyContext, validate: boolean, result?: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.updatingText.path", { userName: ctx.session.userForUpdate.name })
    ];
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewUser#${ctx.session.userForUpdate.id}`);

    if (!validate) text.unshift(ctx.t("utils.shared.titles.validate"));
    else {
        if (result) text.unshift(ctx.t("handlers.states.menuUpdatingUserPhone.success"));
        else text.unshift(ctx.t("handlers.states.updatingUserPhone.error"));
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};