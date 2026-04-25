import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import common from '@utils/common';

export default function main(ctx: MyContext, scheduleLength: number): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const callDistribution = ctx.session.sendout.call;
    const positionId = ctx.session.other.time.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard();
    
    if (common.isAdmin(ctx)) {
        keyboard.text(ctx.t("modules.commands.cabinet.distribution.schedule.main.buttons.create"), `createTime:${nameDistribution}#${positionId}`).style("success");
    }

    // Нет времени
    if (!scheduleLength) {     
        text.push(ctx.t("modules.commands.cabinet.distribution.schedule.main.empty", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("modules.commands.cabinet.distribution.schedule.main.title", { amount: scheduleLength }));

        if (common.isAdmin(ctx)) {
            keyboard.text(ctx.t("utils.shared.buttons.clear"), `clearSchedule:${nameDistribution}`).style("danger").row()
        }

        keyboard.text(ctx.t("utils.shared.buttons.view"), `viewSchedule:${nameDistribution}`).style("primary")
    }
    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `mainDistribution:${ctx.session.sendout.name}`);
    text.push(ctx.t("modules.commands.cabinet.distribution.schedule.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}