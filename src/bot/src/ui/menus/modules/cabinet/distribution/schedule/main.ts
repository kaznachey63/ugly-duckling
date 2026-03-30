import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Time } from '@shared/types/Time';
import format from '@utils/formatting';

export default function main(ctx: MyContext, times: Time[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    const positionId = ctx.session.other.time.positionId;   
     
    let text = [];
    const keyboard = new InlineKeyboard();
    
    if (ctx.session.user.role == 'admin') {
        keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.create"), `createTime:${nameDistribution}#${positionId}`).style("success");
    }

    // Нет времени
    if (!times?.length) {
        console.log(times?.length);
        
        text.push(ctx.t("commands.cabinet.distribution.schedule.main.empty", { call: callDistribution }));
    }
    else {
        console.log(times?.length);

        text.push(ctx.t("commands.cabinet.distribution.schedule.main.title", { amount: times.length }));

        if (ctx.session.user.role == 'admin') {
            keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.clear"), `clearSchedule:${nameDistribution}`).style("danger").row()
        }

        keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.view"), `viewSchedule:${nameDistribution}`).style("primary")
    }
    
    keyboard.row().text(ctx.t("utils.shared.back"), `mainDistribution:${ctx.session.distribution.name}`);
    text.push(ctx.t("commands.cabinet.distribution.schedule.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}