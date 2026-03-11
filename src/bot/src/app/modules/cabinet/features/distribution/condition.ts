import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Status } from '@shared/types/server/Status';
import { ServerManager } from '@utils/ServerManager';
import menuCondition from '@menus/modules/cabinet/distribution/condition';
import common from '@utils/common';

const conditionComposer = new Composer<MyContext>();

conditionComposer.callbackQuery(/^mainCondition:/, async (ctx: MyContext) => {
    try {
        const server = new ServerManager();
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.distribution.name, true) as Status);
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainCondition:', error);
    } finally {
        
    }
});

conditionComposer.callbackQuery(/^startDistribution:/, async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t('utils.shared.processing'));
        const server = new ServerManager();
        await server.startService(ctx.session.distribution.name, true);
        await common.sleep(250);
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.distribution.name, true) as Status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в startDistribution:', error);
    } finally {
        
    }
});

conditionComposer.callbackQuery(/^stopDistribution:/, async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t('utils.shared.processing'));
        const server = new ServerManager();
        await server.stopService(ctx.session.distribution.name, true);
        await common.sleep(250);
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.distribution.name, true) as Status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в stopDistribution:', error);
    } finally {
        
    }
});

conditionComposer.callbackQuery(/^restartDistribution:/, async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t('utils.shared.processing'));
        const server = new ServerManager();
        await server.restartService(ctx.session.distribution.name, true);
        await common.sleep(250);
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.distribution.name, true) as Status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в restartDistribution:', error);
    } finally {
        
    }
});

export default conditionComposer;