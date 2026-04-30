import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import { ServerManager } from 'src/common/services/ServerManager';
import menuClear from '@menus/modules/shared/sendout/view/schedule/clear';

const clearComposer = new Composer<MyContext>();

clearComposer.callbackQuery(/^clearSchedule:/, async (ctx: MyContext) => {
    try {
        await db.schedule.clear(ctx.session.sendout.id!);
        const server = new ServerManager();
        const menu = menuClear(ctx, await server.restartProcessOrNot(ctx.session.sendout.name!, true));

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в clearSchedule:', error);
    }
});

export default clearComposer;