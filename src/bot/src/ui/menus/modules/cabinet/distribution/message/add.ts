import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    const positionId = ctx.session.state.text.positionId;   

    const text = [
        ctx.t("commands.cabinet.distribution.messages.add.main.title", { call: callDistribution }),
        ctx.t("commands.cabinet.distribution.messages.add.main.path", { call: callDistribution }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.add.main.buttons.generate"), `generateText:${nameDistribution}#${positionId}`).style("success")
        .text(ctx.t("commands.cabinet.distribution.messages.add.main.buttons.hand"), `handInputText:${nameDistribution}#${positionId}`).row()
        .text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

function generate(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.add.generate.title"),
        ctx.t("commands.cabinet.distribution.messages.add.generate.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainAddText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function saveOrCancelGenerateText(ctx: MyContext, result: boolean, success?: boolean) {
    let text = [];
    const keyboard = new InlineKeyboard();

    if (result) {
        if (success) {
            text.push(
                ctx.t("commands.cabinet.distribution.messages.add.generate.save"),
                ctx.t("commands.cabinet.distribution.messages.add.generate.pathSave", { call: ctx.session.distribution.call })
            );
            keyboard
                .text(ctx.t("utils.shared.back"), `readMessage:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`)
            ;
        }
        else {
            text.push(
                ctx.t("commands.cabinet.distribution.messages.add.generate.cancel"),
                ctx.t("commands.cabinet.distribution.messages.add.generate.pathSave", { call: ctx.session.distribution.call })
            );
            keyboard
                .text(ctx.t("utils.shared.back"), `mainAddText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`)
            ;
        }
    }
    else {
        text.push(
            ctx.t("commands.cabinet.distribution.messages.add.generate.cancel"),
            ctx.t("commands.cabinet.distribution.messages.add.generate.pathCancel", { call: ctx.session.distribution.call })
        );
        keyboard
            .text(ctx.t("utils.shared.back"), `mainAddText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`)
        ;
    }
    return { text: format.escapeMarkdown(text.join(('\n\n'))), keyboard }
}

function hand(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.add.hand.title"),
        ctx.t("commands.cabinet.distribution.messages.add.hand.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainAddText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    generate,
    saveOrCancelGenerateText,
    hand
}