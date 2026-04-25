import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const callDistribution = ctx.session.sendout.call;
    const positionId = ctx.session.other.text.positionId;   

    const text = [
        ctx.t("commands.cabinet.distribution.messages.create.main.title", { call: callDistribution }),
        ctx.t("commands.cabinet.distribution.messages.create.main.path", { call: callDistribution }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.create.main.buttons.generate"), `generateText:${nameDistribution}#${positionId}`).style("success")
        .text(ctx.t("commands.cabinet.distribution.messages.create.main.buttons.hand"), `handInputText:${nameDistribution}#${positionId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function generate(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.create.generate.title"),
        ctx.t("commands.cabinet.distribution.messages.create.generate.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function saveOrCancelGenerateText(ctx: MyContext, result: boolean, success?: boolean) {
    let text = [];
    const keyboard = new InlineKeyboard();

    if (result) {
        if (success) {
            text.push(
                ctx.t("commands.cabinet.distribution.messages.create.generate.save"),
                ctx.t("commands.cabinet.distribution.messages.create.generate.pathSave", { call: ctx.session.sendout.call })
            );
            keyboard
                .text(ctx.t("utils.shared.buttons.back"), `viewMessagege:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`)
            ;
        }
        else {
            text.push(
                ctx.t("commands.cabinet.distribution.messages.create.generate.cancel"),
                ctx.t("commands.cabinet.distribution.messages.create.generate.pathSave", { call: ctx.session.sendout.call })
            );
            keyboard
                .text(ctx.t("utils.shared.buttons.back"), `mainAddText:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`)
            ;
        }
    }
    else {
        text.push(
            ctx.t("commands.cabinet.distribution.messages.create.generate.cancel"),
            ctx.t("commands.cabinet.distribution.messages.create.generate.pathCancel", { call: ctx.session.sendout.call })
        );
        keyboard
            .text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`)
        ;
    }
    return { text: format.escapeMarkdown(text.join(('\n\n'))), keyboard }
}

function hand(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.create.hand.title"),
        ctx.t("commands.cabinet.distribution.messages.create.hand.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.name}#${ctx.session.other.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    generate,
    saveOrCancelGenerateText,
    hand
}