import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db/index';
import common from '@utils/common';
import menuSchedule from '@menus/modules/cabinet/sendout/schedule/main';
import createComposer from './create';
import clearComposer from './clear';
import viewComposer from './view';

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.callbackQuery(/^mainSchedule:/, async (ctx: MyContext) => {
    try {
        common.resetSessionStates(ctx.session);
        const times = await db.schedule.getSchedule(ctx.session.sendout.schema);
        const menu = menuSchedule(ctx, times?.length!);

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