import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function clearAll(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ?
            ctx.t("commands.cabinet.distribution.messages.clear.success") :
            ctx.t("commands.cabinet.distribution.messages.clear.error")
        ,
        ctx.t("commands.cabinet.distribution.messages.clear.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}