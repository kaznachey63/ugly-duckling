import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db/index';
import local from '@utils/localization';
import { ServerManager } from 'src/common/services/ServerManager';
import menuView from '@menus/modules/cabinet/distribution/schedule/view';
import common from '@utils/common';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewSchedule:/, async (ctx: MyContext) => {
    try {
        common.resetSessionStates(ctx.session);
        const nameDistribution = ctx.session.distribution.name!;
        const times = await db.time.getTimesForBot(nameDistribution);
        const menu = menuView.main(ctx, times!);

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
    } finally {
        
    }
});

viewComposer.callbackQuery(/^removeTime:/, async (ctx: MyContext) => {
    try {
        await db.time.removeTime(ctx.session.distribution.schema, ctx.session.other.time.positionId);
        const server = new ServerManager();
        const menu = menuView.remove(ctx, await server.restartProcessOrNot(ctx.session.distribution.name!, true));
    
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
        const timeId = Number(queryData!.split(/:/)[1]);
        ctx.session.other.time.positionId = timeId;
        const targetTime = local.formatTimeToRu(await db.time.getTime(ctx.session.distribution.schema, timeId));
        const menu = menuView.updateOrRemove(ctx, targetTime!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в updateOrRemoveTime:', error);
    } finally {
        
    }
});

export default viewComposer;