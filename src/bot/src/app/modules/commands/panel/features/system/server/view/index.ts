import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { ProcessType } from '@shared/types/ProcessType';
import menuView from '@menus/modules/commands/panel/system/server/view';
import { ServerManager } from '@common/services/ServerManager';
import conditionComposer from './condition';
import logComposer from './log';

const viewCopmoser = new Composer<MyContext>();

viewCopmoser.callbackQuery(/^mainProcess-/, async (ctx: MyContext) => {
    try {
        const processType = ctx.callbackQuery?.data?.split('-')[1] as ProcessType;
        ctx.session.server.processType = processType;
        const server = new ServerManager();
        const processes = await server.getProcessesByProcessType(processType);
        
        const menu = menuView.process(ctx, processes);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в mainProcess-", error);
    }
});

viewCopmoser.callbackQuery(/^control:/, async (ctx: MyContext) => {
    try {
        ctx.session.server.processName = ctx.callbackQuery?.data?.split(':')[1]!;
        const menu = menuView.control(ctx);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в control", error);
    }
});

viewCopmoser.use(conditionComposer);
viewCopmoser.use(logComposer);

export default viewCopmoser;