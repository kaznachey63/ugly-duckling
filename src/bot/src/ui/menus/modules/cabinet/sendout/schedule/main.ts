import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Time } from '@shared/types/Time';
import format from '@utils/formatting';
import common from '@utils/common';

export default function main(ctx: MyContext, times: Time[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const callDistribution = ctx.session.sendout.call;
    const positionId = ctx.session.other.time.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard();
    
    if (common.isAdmin(ctx.session.user.role)) {
        keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.create"), `createTime:${nameDistribution}#${positionId}`).style("success");
    }

    // Нет времени
    if (!times?.length) {     
        text.push(ctx.t("commands.cabinet.distribution.schedule.main.empty", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("commands.cabinet.distribution.schedule.main.title", { amount: times.length }));

        if (common.isAdmin(ctx.session.user.role)) {
            keyboard.text(ctx.t("commands.cabinet.profile.contract.main.buttons.clear"), "clearContract").style("danger").row()
        }

        keyboard.text(ctx.t("commands.cabinet.profile.contract.main.buttons.view"), "viewContract").style("primary")
    }
    
    keyboard.row().text(ctx.t("utils.shared.back"), "mainProfile");
    text.push(ctx.t("commands.cabinet.distribution.schedule.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}