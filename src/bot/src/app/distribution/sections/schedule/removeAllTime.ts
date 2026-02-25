import db from '@shared/db/index';
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/distribution/sections/schedule';
import { ServerManager } from '@utils/ServerManager';

/**
 * Очистка графика времён
 */
export default async function removeAllTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    let text = [];

    if (!String(nameDistribution)) {
        text.push("distribution.section.schedule.clearAll.error");
    }
    else {
        await db.time.clearTableTimes(ctx.session.distribution.schema);
        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push("distribution.section.schedule.clearAll.success");
        }
        else {
            text.push("distribution.section.schedule.clearAll.error");
        }
    }
    text.push("distribution.section.schedule.clearAll.path");
    const menu = menuSchedule.clearAll(ctx, text);

    await ctx.editMessageText(menu.text,
    {
        parse_mode: "MarkdownV2", 
        reply_markup: menu.keyboard
    });
}