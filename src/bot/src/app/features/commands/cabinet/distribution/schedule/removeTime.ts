import db from '@shared/db/index';
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/commands/cabinet/distribution/sections/schedule';
import { ServerManager } from '@utils/ServerManager';

/**
 * Удаление времени из графика
 */
export default async function removeTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    let text = [];

    if (!String(nameDistribution)) {
        text.push("distribution.sections.schedule.remove.error");
    }
    else {
        await db.time.removeTime(ctx.session.distribution.schema, ctx.session.typePartition.time.id);
        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push("distribution.sections.schedule.remove.success");
        }
        else {
            text.push("distribution.sections.schedule.remove.error");
        }
    }
    text.push("distribution.sections.schedule.path");
    const menu = menuSchedule.remove(ctx, text);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2", 
        reply_markup: menu.keyboard
    });
}