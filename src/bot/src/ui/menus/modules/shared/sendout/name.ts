import type { MyContext } from "@shared/types/SessionData";
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import formatting from "@utils/formatting";

/**
 * Меню просмотра имен рассылки
 */
function main(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const text: string[] = [
        ctx.t("modules.shared.sendout.view.name.main.title"),
        ctx.t("modules.shared.sendout.view.name.main.about"),
        '',
        ctx.t("modules.shared.sendout.view.name.main.path", { call: ctx.session.sendout.call }),
    ];

    const keyboard = new InlineKeyboard()
        .text(ctx.session.sendout.call ?? ctx.t("utils.shared.nameless"), `mainUpdateSendoutCall:${sendoutId}`).row()
        .text(ctx.session.sendout.label!, `mainUpdateSendoutLabel:${sendoutId}`).row()
        .text(ctx.session.sendout.name!, `mainUpdateSendoutName:${sendoutId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `viewSendout:${sendoutId}`)
    ;

    return { text: formatting.escapeMarkdown(text.join('\n')), keyboard }
}

/**
 * Меню приема позывного рассылки
 */
function updateCall(ctx: MyContext): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("modules.shared.sendout.view.name.update.call.title"),
        ctx.t("modules.shared.sendout.view.name.update.call.path", { call: ctx.session.sendout.call }),
    ];

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainSendoutNames:${ctx.session.sendout.id}`);
    return { text: formatting.escapeMarkdown(text.join('\n\n')), keyboard }
}

// /**
//  * Меню приема подписи рассылки
//  */
// function updateLabel(ctx: MyContext): Menu<InlineKeyboard> {
//     const text: string[] = [
//         ctx.t("modules.shared.sendout.view.name.update.label.title"),
//         ctx.t("modules.shared.sendout.view.name.update.label.path", { call: ctx.session.sendout.call }),
//     ];

//     const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainSendoutNames:${ctx.session.sendout.id}`);
//     return { text: formatting.escapeMarkdown(text.join('\n\n')), keyboard }
// }

// /**
//  * Меню приема наименования рассылки
//  */
// function updateName(ctx: MyContext): Menu<InlineKeyboard> {
//     const text: string[] = [
//         ctx.t("modules.shared.sendout.view.name.update.name.title"),
//         ctx.t("modules.shared.sendout.view.name.update.name.path", { call: ctx.session.sendout.call }),
//     ];

//     const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainSendoutNames:${ctx.session.sendout.id}`);
//     return { text: formatting.escapeMarkdown(text.join('\n\n')), keyboard }
// }

export default {
    main,
    updateCall,
    // updateLabel,
    // updateName,
}