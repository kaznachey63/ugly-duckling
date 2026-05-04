import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Status } from '@shared/types/server/Status';
import { ServerManager } from 'src/common/services/ServerManager';
import menuCondition from '@menus/modules/shared/sendout/view/condition';
import { sleep } from 'telegram/Helpers';

const conditionComposer = new Composer<MyContext>();

conditionComposer.callbackQuery(/^mainCondition:/, async (ctx: MyContext) => {
    try {
        const server = new ServerManager();
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.sendout.name!, true) as Status);
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainCondition:', error);
    } finally {
        
    }
});

conditionComposer.callbackQuery(/^startSendout:/, async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t("utils.shared.processing"));
        const server = new ServerManager();
        await server.startService(ctx.session.sendout.name!, true);
        await sleep(250);
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.sendout.name!, true) as Status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в startSendout:', error);
    } finally {
        
    }
});

conditionComposer.callbackQuery(/^stopSendout:/, async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t("utils.shared.processing"));
        const server = new ServerManager();
        await server.stopService(ctx.session.sendout.name!, true);
        await sleep(250);
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.sendout.name!, true) as Status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в stoptSendout:', error);
    } finally {
        
    }
});

conditionComposer.callbackQuery(/^restartSendout:/, async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t("utils.shared.processing"));
        const server = new ServerManager();
        await server.restartService(ctx.session.sendout.name!, true);
        await sleep(250);
        const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.sendout.name!, true) as Status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в restartSendout:', error);
    } finally {
        
    }
});

export default conditionComposer;