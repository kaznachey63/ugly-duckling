import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Результат добавления медиа
 */
export default function addingMedia(ctx: MyContext, validate: boolean, result?: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [];

    if (!validate) {
        text.push(ctx.t("utils.shared.titles.validate"));
        keyboard.url(ctx.t("utils.shared.buttons.insrtruction"), constants.link.instruction.media.add);
    }
    else {
        if (result) {
            text.push(ctx.t("handlers.states.addingMedia.success"));
            if (ctx.session.message.media?.length! <= 3) keyboard.text(ctx.t("modules.shared.sendout.view.message.view.main.buttons.addMedia"), `addMedia:${ctx.session.sendout.id}#${ctx.session.message.id}`).style("success");
            text.push(ctx.t("handlers.states.addingMedia.amount", { now: ctx.session.message.media?.length, all: constants.media.maxMedia }));
        }
        else {
            text.push(ctx.t("handlers.states.addingMedia.error"));
            keyboard.url(ctx.t("utils.shared.buttons.contactAdmin"), constants.link.tgAdmin)
        }
    }
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}-none`);
    text.push(ctx.t("handlers.states.addingMedia.path", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }));

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
};