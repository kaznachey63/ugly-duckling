import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { ProcessType } from '@shared/types/ProcessType';
import menuServer from '@menus/modules/commands/panel/system/server/main';
import conditionComposer from './condition';
import logComposer from './log';
import { ServerManager } from '@common/services/ServerManager';

const serverComposer = new Composer<MyContext>();

serverComposer.callbackQuery("mainServer", async (ctx: MyContext) => {
    try {
        const menu = menuServer.main(ctx);
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в mainServer", error);
    }
});

serverComposer.callbackQuery(/^mainProcess-/, async (ctx: MyContext) => {
    try {
        const processType = ctx.callbackQuery?.data?.split('-')[1] as ProcessType;
        ctx.session.server.processType = processType;
        const server = new ServerManager();
        const processes = await server.getProcessesByProcessType(processType);
        console.log(processes);
        
        const menu = menuServer.process(ctx, processes);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в mainProcess-", error);
    }
});

serverComposer.callbackQuery(/^control:/, async (ctx: MyContext) => {
    try {
        ctx.session.server.processName = ctx.callbackQuery?.data?.split(':')[1]!;
        const menu = menuServer.control(ctx);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в control", error);
    }
});

serverComposer.use(conditionComposer);
serverComposer.use(logComposer);

export default serverComposer;