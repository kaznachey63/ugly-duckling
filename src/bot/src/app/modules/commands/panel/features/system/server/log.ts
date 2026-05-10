import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuLog from '@menus/modules/commands/panel/system/server/log';
import type { LogSortType } from '@shared/types/LogSortType';
import { ServerManager } from '@common/services/ServerManager';

const logComposer = new Composer<MyContext>();

logComposer.callbackQuery("mainLog", async (ctx: MyContext) => {
    try {
        ctx.session.server.logPage = 0;

        const server = new ServerManager();
        const logs = await server.getLogsByProcessName(ctx.session.server.processName);

        const menu = menuLog(ctx, logs);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в mainLog", error);
    }
});

logComposer.callbackQuery(/^sortLog-/, async (ctx: MyContext) => {
    try {
        ctx.session.server.logPage = 0;

        const server = new ServerManager();
        ctx.session.server.logSort = ctx.callbackQuery?.data?.split('-')[1] as LogSortType;
        const logs = await server.getLogsByProcessName(ctx.session.server.processName);

        const menu = menuLog(ctx, logs);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в mainLog", error);
    }
});

logComposer.callbackQuery(/^logPage-(\d+)$/, async (ctx: MyContext) => {
    try {
        ctx.session.server.logPage = Number(ctx.match![1]!);

        const server = new ServerManager();
        const logs = await server.getLogsByProcessName(ctx.session.server.processName);

        const menu = menuLog(ctx, logs);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в logPage", error);
    }
});

export default logComposer;