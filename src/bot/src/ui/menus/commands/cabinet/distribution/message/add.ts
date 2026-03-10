import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

function generate(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.messages.add.generate.title"),
        ctx.t("commands.cabinet.distribution.messages.add.generate.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainAddText:${ctx.session.distribution.name}#${ctx.session.state.text.positionId}`);
    return { text: format.escapeMarkdown(text), keyboard }
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
    generate,
    hand
}