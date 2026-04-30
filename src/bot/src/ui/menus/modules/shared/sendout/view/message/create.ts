import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const callDistribution = ctx.session.sendout.call;
    const positionId = ctx.session.message.position;   

    const text = [
        ctx.t("modules.commands.cabinet.distribution.messages.create.main.title", { call: callDistribution }),
        ctx.t("modules.commands.cabinet.distribution.messages.create.main.path", { call: callDistribution }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.cabinet.distribution.messages.create.main.buttons.generate"), `generateText:${sendoutId}#${positionId}`).style("success")
        .text(ctx.t("modules.commands.cabinet.distribution.messages.create.main.buttons.hand"), `handInputText:${sendoutId}#${positionId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function generate(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.cabinet.distribution.messages.create.generate.title"),
        ctx.t("modules.commands.cabinet.distribution.messages.create.generate.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function saveOrCancelGenerateText(ctx: MyContext, result: boolean, success?: boolean) {
    let text = [];
    const keyboard = new InlineKeyboard();

    if (result) {
        if (success) {
            text.push(
                ctx.t("modules.commands.cabinet.distribution.messages.create.generate.save"),
                ctx.t("modules.commands.cabinet.distribution.messages.create.generate.pathSave", { call: ctx.session.sendout.call })
            );
            keyboard
                .text(ctx.t("utils.shared.buttons.back"), `viewMessagege:${ctx.session.sendout.name}#${ctx.session.message.position}`)
            ;
        }
        else {
            text.push(
                ctx.t("modules.commands.cabinet.distribution.messages.create.generate.cancel"),
                ctx.t("modules.commands.cabinet.distribution.messages.create.generate.pathSave", { call: ctx.session.sendout.call })
            );
            keyboard
                .text(ctx.t("utils.shared.buttons.back"), `mainAddText:${ctx.session.sendout.name}#${ctx.session.message.position}`)
            ;
        }
    }
    else {
        text.push(
            ctx.t("modules.commands.cabinet.distribution.messages.create.generate.cancel"),
            ctx.t("modules.commands.cabinet.distribution.messages.create.generate.pathCancel", { call: ctx.session.sendout.call })
        );
        keyboard
            .text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.name}#${ctx.session.message.position}`)
        ;
    }
    return { text: format.escapeMarkdown(text.join(('\n\n'))), keyboard }
}

function hand(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.cabinet.distribution.messages.create.hand.title"),
        ctx.t("modules.commands.cabinet.distribution.messages.create.hand.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainCreateText:${ctx.session.sendout.name}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    generate,
    saveOrCancelGenerateText,
    hand
}