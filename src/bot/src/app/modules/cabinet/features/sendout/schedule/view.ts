import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db/index';
import local from '@utils/localization';
import { ServerManager } from 'src/common/services/ServerManager';
import menuView from '@menus/modules/cabinet/sendout/schedule/view';
import common from '@utils/common';
import menuSchedule from '@menus/modules/cabinet/sendout/schedule/main';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewSchedule:/, async (ctx: MyContext) => {
    try {
        common.resetSessionStates(ctx.session);
        const times = await db.schedule.getScheduleForBot(ctx.session.sendout.schema);
        
        let menu;
        if (!times || times.length <= 0) menu = menuSchedule(ctx, times!);
        else menu = menuView.main(ctx, times!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainSchedule:', error);
    }
});

viewComposer.callbackQuery(/^updateTime:/, async (ctx: MyContext) => {
    try {
        ctx.session.state.updatingTime = true;
        const timeId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
        ctx.session.other.time.positionId = timeId;
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
    try {
        await db.schedule.removeTime(ctx.session.sendout.schema, ctx.session.other.time.positionId);
        if ((await db.schedule.getScheduleForBot(ctx.session.sendout.schema))?.length == 0) {
            await db.schedule.clearTable(ctx.session.sendout.schema);
        }
        const server = new ServerManager();
        const menu = menuView.remove(ctx, await server.restartProcessOrNot(ctx.session.sendout.name!, true));
    
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в removeTime:', error);
    }
});

viewComposer.callbackQuery(/^updateOrRemoveTime:/, async (ctx: MyContext) => {
    try {
        const queryData = ctx.callbackQuery?.data;
        const timeId = Number(queryData!.split(/#/)[1]);
        ctx.session.other.time.positionId = timeId;
        const targetTime = local.formatTimeToRu((await db.schedule.getTime(ctx.session.sendout.schema, timeId))!);
        const menu = menuView.updateOrRemove(ctx, targetTime!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в updateOrRemoveTime:', error);
    }
});

export default viewComposer;