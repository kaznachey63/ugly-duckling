import db from '@shared/db/index';
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/commands/cabinet/distribution/schedule';
import { ServerManager } from '@utils/ServerManager';

/**
 * Очистка графика времён
 */
export default async function clearSchedule(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    let text = [];

    if (!String(nameDistribution)) {
        text.push(commands.cabinet.distribution.schedule.clearSchedule.error");
    }
    else {
        await db.time.clearTableTimes(ctx.session.distribution.schema);
        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push(commands.cabinet.distribution.schedule.clearSchedule.success");
        }
        else {
            text.push(commands.cabinet.distribution.schedule.clearSchedule.error");
        }
    }
    text.push(commands.cabinet.distribution.schedule.clearSchedule.path");
    const menu = menuSchedule.clearSchedule(ctx, text);

    await ctx.editMessageText(menu.text,
    {
        parse_mode: "MarkdownV2", 
        reply_markup: menu.keyboard
    });
}