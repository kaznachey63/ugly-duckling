import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { IMessage } from '@shared/types/IMessage';

export default function main(ctx: MyContext, messages: IMessage[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    const positionId = ctx.session.other.text.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard().text(ctx.t("commands.cabinet.distribution.messages.main.buttons.create"), `mainCreateText:${nameDistribution}#${positionId}`).style("success");

    // Нет сообщений
    if (!messages?.length) {
        text.push(ctx.t("commands.cabinet.distribution.messages.main.empty", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("commands.cabinet.distribution.messages.main.title", { amount: positionId }));
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clear"), `clearMessages:${nameDistribution}`).style("danger").row()
        keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.view"), `viewMessage:${nameDistribution}#0`).style("primary")
    }
    keyboard.row().text(ctx.t("utils.shared.back"), `mainDistribution:${ctx.session.distribution.name}`);
    text.push(ctx.t("commands.cabinet.distribution.messages.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}