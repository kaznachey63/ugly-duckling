import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function main(ctx: MyContext, messagesLength: number): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const callDistribution = ctx.session.sendout.call;
    const positionId = ctx.session.other.text.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard().text(ctx.t("modules.commands.cabinet.distribution.messages.main.buttons.create"), `mainCreateText:${nameDistribution}#${positionId}`).style("success");

    // Нет сообщений
    if (!messagesLength) {
        text.push(ctx.t("modules.commands.cabinet.distribution.messages.main.empty", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("modules.commands.cabinet.distribution.messages.main.title", { amount: positionId }));
        keyboard
            .text(ctx.t("utils.shared.buttons.clear"), `clearMessages:${nameDistribution}`).style("danger").row()
            .text(ctx.t("utils.shared.export"), `mainExportMessages:${ctx.session.sendout.name}`)
            .text(ctx.t("utils.shared.buttons.view"), `viewMessage:${nameDistribution}#0`).style("primary")
        ;
    }
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `mainDistribution:${ctx.session.sendout.name}`);
    text.push(ctx.t("modules.commands.cabinet.distribution.messages.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}