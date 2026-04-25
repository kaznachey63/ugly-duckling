import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.cabinet.distribution.schedule.create.title"),
        ctx.t("modules.commands.cabinet.distribution.schedule.create.path", { call: ctx.session.sendout.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}