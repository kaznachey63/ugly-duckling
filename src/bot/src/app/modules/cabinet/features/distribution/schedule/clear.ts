import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db/index';
import { ServerManager } from 'src/common/services/ServerManager';
import menuClear from '@menus/modules/cabinet/distribution/schedule/clear';

const clearComposer = new Composer<MyContext>();

clearComposer.callbackQuery(/^clearSchedule:/, async (ctx: MyContext) => {
    try {
        const nameDistribution = ctx.session.distribution.name!;
        let text: string[] = [];

        if (!String(nameDistribution)) {
            text.push('commands.cabinet.distribution.schedule.clearSchedule.error');
        } else {
            await db.time.clearTableTimes(ctx.session.distribution.schema);
            const server = new ServerManager();
            if (await server.restartProcessOrNot(nameDistribution, true)) {
                text.push('commands.cabinet.distribution.schedule.clearSchedule.success');
            } else {
                text.push('commands.cabinet.distribution.schedule.clearSchedule.error');
            }
        }
        text.push('commands.cabinet.distribution.schedule.clearSchedule.path');
        const menu = menuClear(ctx, text);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в clearSchedule:', error);
    } finally {
        
    }
});

export default clearComposer;