import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import common from '@utils/common';
import menuSchedule from '@menus/modules/shared/sendout/schedule/main';
import createComposer from './create';
import clearComposer from './clear';
import viewComposer from './view';
import exportComposer from './export';

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.callbackQuery(/^mainSchedule:/, async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const schedule = await db.schedule.get(ctx.session.sendout.id!);
    const menu = menuSchedule(ctx, schedule?.length!);

    try {
        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
        
        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
        const msg = await ctx.reply(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }    
    }
});

scheduleComposer.use(createComposer);
scheduleComposer.use(clearComposer);
scheduleComposer.use(viewComposer);
scheduleComposer.use(exportComposer);

export default scheduleComposer;