import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import { ServerManager } from '@common/services/ServerManager';
import menuView from '@menus/modules/shared/sendout/schedule/view';
import common from '@utils/common';
import menuSchedule from '@menus/modules/shared/sendout/schedule/main';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewSchedule:/, async (ctx: MyContext) => {
    try {
        common.resetSessionStates(ctx.session);
        const schedule = await db.schedule.get(ctx.session.sendout.id!);
        
        let menu;
        if (!schedule || schedule.length <= 0) menu = menuSchedule(ctx, 0);
        else menu = menuView.main(ctx, schedule!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в viewSchedule:', error);
    }
});

viewComposer.callbackQuery(/^updateOrRemoveTime:/, async (ctx: MyContext) => {
    if (!ctx.session.isAdmin) return;
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }

    try {
        const queryData = ctx.callbackQuery?.data;
        const timeId = Number(queryData!.split(/#/)[1]);
        ctx.session.schedule.id = timeId;
        const { label: targetTime } = (await db.schedule.getTime(timeId))!;
        const menu = menuView.updateOrRemove(ctx, targetTime!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в updateOrRemoveTime:', error);
    }
});

viewComposer.callbackQuery(/^updateTime:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }

    try {
        ctx.session.state.updatingTime = true;
        ctx.session.schedule.id = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
        const menu = menuView.update(ctx);

        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });

        if (typeof msg !== 'boolean' && 'message_id' in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        console.error('Ошибка в updateTime:', error);
    }
});

viewComposer.callbackQuery(/^removeTime:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }
    
    try {
        const timeId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
        ctx.session.schedule.id = timeId;
        const sendoutId = ctx.session.sendout.id;
        await db.schedule.remove(timeId!);
        if ((await db.schedule.get(sendoutId!))?.length == 0) {
            await db.schedule.clear(sendoutId!);
        }
        const menu = menuView.remove(ctx, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true));
    
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в removeTime:', error);
    }
});

export default viewComposer;