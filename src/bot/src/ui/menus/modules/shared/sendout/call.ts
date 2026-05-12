import type { MyContext } from "@shared/types/SessionData";
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import formatting from "@utils/formatting";

/**
 * Меню просмотра позывного рассылки
 */
function main(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const text: string[] = [
        ctx.t("modules.shared.sendout.view.owner.main.path", { call: ctx.session.sendout.call }),
    ];

    if (ctx.session.sendout.call?.length! > 0) text.unshift(ctx.t("modules.shared.sendout.view.owner.main.call", { call: ctx.session.sendout.call }));
    else text.unshift(ctx.t("modules.shared.sendout.view.owner.main.empty"));

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.buttons.update"), `mainUpdateSendoutCall:${sendoutId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `viewSendout:${sendoutId}`)
    ;

    return { text: formatting.escapeMarkdown(text.join('\n')), keyboard }
}

/**
 * Меню приема позывного рассылки
 */
function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("modules.shared.sendout.view.call.update.main.title"),
        ctx.t("modules.shared.sendout.view.call.update.main.path", { call: ctx.session.sendout.call }),
    ];

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainSendoutCall:${ctx.session.sendout.id}`);
    return { text: formatting.escapeMarkdown(text.join('\n\n')), keyboard }
}

export default {
    main,
    update,
}