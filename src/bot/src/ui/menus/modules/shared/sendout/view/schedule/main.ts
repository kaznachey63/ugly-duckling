import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function main(ctx: MyContext, scheduleLength: number): Menu<InlineKeyboard> {
    const sendoutName = ctx.session.sendout.name;
    const sendoutCall = ctx.session.sendout.call;
    const positionId = ctx.session.other.time.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard();
    
    if (ctx.session.isAdmin) {
        keyboard.text(ctx.t("utils.shared.buttons.create"), `createTime:${sendoutName}#${positionId}`).style("success");
    }

    // Нет времени
    if (!scheduleLength) {     
        text.push(ctx.t("modules.shared.sendout.view.sendout.schedule.main.empty", { call: sendoutCall }));
    }
    else {
        text.push(ctx.t("modules.shared.sendout.view.sendout.schedule.main.title", { amount: scheduleLength }));

        if (ctx.session.isAdmin) {
            keyboard.text(ctx.t("utils.shared.buttons.clear"), `clearSchedule:${sendoutName}`).style("danger").row()
        }

        keyboard.text(ctx.t("utils.shared.buttons.view"), `viewSchedule:${sendoutName}`).style("primary")
    }
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewSendout:${ctx.session.sendout.name}`);
    text.push(ctx.t("modules.shared.sendout.view.sendout.schedule.main.path", { call: sendoutCall, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }));
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}