import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import common from '@utils/common';
import menuSchedule from '@menus/modules/shared/sendout/schedule/main';
import createComposer from './create';
import clearComposer from './clear';
import viewComposer from './view';

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.callbackQuery(/^mainSchedule:/, async (ctx: MyContext) => {
    try {
        common.resetSessionStates(ctx.session);
        const schedule = await db.schedule.get(ctx.session.sendout.id!);
        const menu = menuSchedule(ctx, schedule?.length!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainSchedule:', error);
    }
});

scheduleComposer.use(createComposer);
scheduleComposer.use(clearComposer);
scheduleComposer.use(viewComposer);

export default scheduleComposer;