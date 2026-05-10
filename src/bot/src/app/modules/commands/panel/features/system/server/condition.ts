import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { ProcessStatus } from '@shared/types/ProcessStatus';
import { ServerManager } from '@common/services/ServerManager';
import menuCondition from '@menus/modules/commands/panel/system/server/condition';
import { sleep } from 'telegram/Helpers';

const conditionComposer = new Composer<MyContext>();

conditionComposer.callbackQuery("mainCondition", async (ctx: MyContext) => {
    try {
        const server = new ServerManager();
        const status = await server.getProcessStatus(ctx.session.server.processName);
        const menu = menuCondition(ctx, status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainCondition:', error);
    }
});

conditionComposer.callbackQuery("startProcess", async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t("utils.shared.processing"));
        const server = new ServerManager();
        await server.startProcess(ctx.session.server.processName);
        await sleep(250);
        const status = await server.getProcessStatus(ctx.session.server.processName);
        const menu = menuCondition(ctx, status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в startProcess:', error);
    }
});

conditionComposer.callbackQuery("stopProcess", async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t("utils.shared.processing"));
        const server = new ServerManager();
        await server.stopProcess(ctx.session.server.processName);
        await sleep(250);
        const status = await server.getProcessStatus(ctx.session.server.processName);
        const menu = menuCondition(ctx, status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в stopProcess", error);
    }
});

conditionComposer.callbackQuery("restartProcess", async (ctx: MyContext) => {
    try {
        await ctx.editMessageText(ctx.t("utils.shared.processing"));
        const server = new ServerManager();
        await server.restartProcess(ctx.session.server.processName);
        await sleep(250);
        const status = await server.getProcessStatus(ctx.session.server.processName);
        const menu = menuCondition(ctx, status);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в restartProcess", error);
    }
});

export default conditionComposer;