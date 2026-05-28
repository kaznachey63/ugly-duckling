import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Результат добавления времени
 */
export default function addingTime(ctx: MyContext, result: boolean, validate: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("handlers.states.addingTime.path", { call: ctx.session.sendout.call })
    ];
    const keyboard = new InlineKeyboard();

    if (!validate) {
        text.unshift(ctx.t("utils.shared.titles.validate"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);            
    }
    else {
        if (result) {
            text.unshift(ctx.t("handlers.states.addingTime.success"));
            keyboard
                .text(ctx.t("utils.shared.buttons.create"), "mainContract")
                .text(ctx.t("utils.shared.buttons.back"), `viewSchedule:${ctx.session.sendout.id}`).row()
            ;
        }
        else {
            text.unshift(ctx.t("handlers.states.addingTime.error"));
            keyboard
                .url(ctx.t("utils.shared.buttons.contactAdmin"), constants.link.tgAdmin)
                .text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`).row()
            ;            
        }
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};