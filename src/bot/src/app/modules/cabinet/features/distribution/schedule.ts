import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db/index';
import local from '@utils/localization';
import common from '@utils/common';
import { ServerManager } from '@utils/ServerManager';
import menuSchedule from '@menus/commands/cabinet/distribution/schedule';

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.callbackQuery(/^mainSchedule:/, async (ctx: MyContext) => {
    try {
        common.resetSessionStates(ctx.session);
        const nameDistribution = ctx.session.distribution.name!;
        const times = await db.time.getTimesForBot(nameDistribution);
        const menu = menuSchedule.main(ctx, times!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainSchedule:', error);
    } finally {
        
    }
});

scheduleComposer.callbackQuery(/^addTime:/, async (ctx: MyContext) => {
    try {
        ctx.session.state.time.adding = true;
        const menu = menuSchedule.add(ctx);

        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });

        if (typeof msg !== 'boolean' && 'message_id' in msg) {
            ctx.session.state.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        console.error('Ошибка в addTime:', error);
    } finally {
        
    }
});

scheduleComposer.callbackQuery(/^updateTime:/, async (ctx: MyContext) => {
    try {
        ctx.session.state.time.updating = true;
        const menu = menuSchedule.update(ctx);

        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });

        if (typeof msg !== 'boolean' && 'message_id' in msg) {
            ctx.session.state.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        console.error('Ошибка в updateTime:', error);
    } finally {
        
    }
});

scheduleComposer.callbackQuery(/^clearSchedule:/, async (ctx: MyContext) => {
    try {
        const nameDistribution = ctx.session.distribution.name!;
        let text: string[] = [];

        if (!String(nameDistribution)) {
            text.push('commands.cabinet.distribution.schedule.clearSchedule.error');
        } else {
            await db.time.clearTableTimes(ctx.session.distribution.schema);
            const server = new ServerManager();
            if (await server.restartProcessOrNot(nameDistribution)) {
                text.push('commands.cabinet.distribution.schedule.clearSchedule.success');
            } else {
                text.push('commands.cabinet.distribution.schedule.clearSchedule.error');
            }
        }
        text.push('commands.cabinet.distribution.schedule.clearSchedule.path');
        const menu = menuSchedule.clearSchedule(ctx, text);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в clearSchedule:', error);
    } finally {
        
    }
});


scheduleComposer.callbackQuery('parametersSchedule', async (ctx: MyContext) => {
    try {
        await ctx.answerCallbackQuery({
            text: ctx.t('commands.cabinet.distribution.schedule.parameters.alert'),
            show_alert: true
        });
    } catch (error) {
        console.error('Ошибка в parametersTime:', error);
    }
});

scheduleComposer.callbackQuery(/^removeTime:/, async (ctx: MyContext) => {
    try {
        const nameDistribution = ctx.session.distribution.name!;
        let text: string[] = [];

        if (!String(nameDistribution)) {
            text.push('commands.cabinet.distribution.schedule.remove.error');
        } else {
            await db.time.removeTime(ctx.session.distribution.schema, ctx.session.state.time.positionId);
            const server = new ServerManager();
            if (await server.restartProcessOrNot(nameDistribution)) {
                text.push('commands.cabinet.distribution.schedule.remove.success');
            } else {
                text.push('commands.cabinet.distribution.schedule.remove.error');
            }
        }
        text.push('commands.cabinet.distribution.schedule.path');
        const menu = menuSchedule.remove(ctx, text);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в removeTime:', error);
    } finally {
        
    }
});

scheduleComposer.callbackQuery(/^updateOrRemoveTime:/, async (ctx: MyContext) => {
    try {
        const queryData = ctx.callbackQuery?.data;
        const timeId = Number(queryData!.split(/:/)[1]);
        ctx.session.state.time.positionId = timeId;
        const targetTime = local.formatTimeToRu(await db.time.getTime(ctx.session.distribution.schema, timeId));
        const menu = menuSchedule.updateOrRemove(ctx, targetTime!);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в updateOrRemoveTime:', error);
    } finally {
        
    }
});

export default scheduleComposer;