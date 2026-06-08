import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@common/constants';

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const sendoutCal = ctx.session.sendout.call;

    const text = [
        ctx.t("modules.shared.sendout.view.message.create.main.title", { call: sendoutCal }),
        ctx.t("modules.shared.sendout.view.message.create.main.path", { call: sendoutCal,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.message.create.main.buttons.generate"), `generateText:${sendoutId}`).style("success")
        .text(ctx.t("modules.shared.sendout.view.message.create.main.buttons.hand"), `handInputText:${sendoutId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function generate(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.message.create.generate.title"),
        ctx.t("modules.shared.sendout.view.message.create.generate.path", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.id}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function saveOrCancelGenerateText(ctx: MyContext, result: boolean, success?: boolean) {
    const sendoutId = ctx.session.sendout.id;
    let text = [];
    const keyboard = new InlineKeyboard();

    if (result) {
        if (success) {
            text.push(
                ctx.t("modules.shared.sendout.view.message.create.generate.save"),
                ctx.t("modules.shared.sendout.view.message.create.generate.pathSave", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
            );
            keyboard
                .text(ctx.t("utils.shared.buttons.back"), `mainMessage:${sendoutId}`)
            ;
        }
        else {
            text.push(
                ctx.t("modules.shared.sendout.view.message.create.generate.cancel"),
                ctx.t("modules.shared.sendout.view.message.create.generate.pathSave", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
            );
            keyboard
                .text(ctx.t("utils.shared.buttons.back"), `mainMessage:${sendoutId}`)
            ;
        }
    }
    else {
        text.push(
            ctx.t("modules.shared.sendout.view.message.create.generate.cancel"),
            ctx.t("modules.shared.sendout.view.message.create.generate.pathCancel", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
        );
        keyboard
            .text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${sendoutId}`)
        ;
    }
    return { text: format.escapeMarkdown(text.join(('\n\n'))), keyboard }
}

function hand(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.message.create.hand.title"),
        ctx.t("modules.shared.sendout.view.message.create.hand.path", { call: ctx.session.sendout.call,  menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .url(ctx.t("utils.shared.buttons.instruction"), constants.link.instruction.text.add.hand).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.id}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    generate,
    saveOrCancelGenerateText,
    hand
}