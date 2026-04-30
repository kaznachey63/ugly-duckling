import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function main(ctx: MyContext, messagesLength: number, error: boolean): Menu<InlineKeyboard> {
    const sendoutName = ctx.session.sendout.name;
    const sendoutCall = ctx.session.sendout.call;
    const positionId = ctx.session.message.position;   
     
    let text = [];
    const keyboard = new InlineKeyboard().text(ctx.t("modules.shared.sendout.view.sendout.message.main.buttons.create"), `mainCreateText:${sendoutName}#${positionId}`).style("success");
    if (error) {
        text.push(ctx.t("modules.shared.sendout.view.sendout.message.main.error"));
    }
    else {
        // Нет сообщений
        if (!messagesLength) {
            text.push(ctx.t("modules.shared.sendout.view.sendout.message.main.empty", { call: sendoutCall }));
        }
        else {
            text.push(ctx.t("modules.shared.sendout.view.sendout.message.main.title", { amount: positionId }));
            keyboard
                .text(ctx.t("utils.shared.buttons.clear"), `clearMessages:${sendoutName}`).style("danger").row()
                .text(ctx.t("utils.shared.export"), `mainExportMessages:${ctx.session.sendout.name}`)
                .text(ctx.t("utils.shared.buttons.view"), `viewMessage:${sendoutName}#0`).style("primary")
            ;
        }
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewSendout:${ctx.session.sendout.name}`);
    text.push(ctx.t("modules.shared.sendout.view.sendout.message.main.path", { call: sendoutCall, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }));
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}