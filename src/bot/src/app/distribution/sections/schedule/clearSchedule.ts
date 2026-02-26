import db from '@shared/db/index';
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/distribution/sections/schedule';
import { ServerManager } from '@utils/ServerManager';

/**
 * Очистка графика времён
 */
export default async function clearSchedule(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    let text = [];

    if (!String(nameDistribution)) {
        text.push("distribution.sections.schedule.clearSchedule.error");
    }
    else {
        await db.time.clearTableTimes(ctx.session.distribution.schema);
        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push("distribution.sections.schedule.clearSchedule.success");
        }
        else {
            text.push("distribution.sections.schedule.clearSchedule.error");
        }
    }
    text.push("distribution.sections.schedule.clearSchedule.path");
    const menu = menuSchedule.clearSchedule(ctx, text);

    await ctx.editMessageText(menu.text,
    {
        parse_mode: "MarkdownV2", 
        reply_markup: menu.keyboard
    });
}