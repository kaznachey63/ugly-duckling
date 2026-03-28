import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function clearAll(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t("commands.cabinet.distribution.messages.clearAll.success") :
            ctx.t("commands.cabinet.distribution.messages.clearAll.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.clearAll.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainMessage:${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}