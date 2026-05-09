import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { ProcessType } from '@shared/types/ProcessType';
import menuServer from '@menus/modules/commands/panel/system/server/main';
import conditionComposer from './condition';
import logComposer from './log';

const serverComposer = new Composer<MyContext>();

serverComposer.callbackQuery("mainServer", async (ctx: MyContext) => {
    try {
        const menu = menuServer.main(ctx);
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainServer:', error);
    }
});

serverComposer.callbackQuery(/^mainProcess-/, async (ctx: MyContext) => {
    try {
        ctx.session.processType = ctx.callbackQuery?.data?.split('-')[1] as ProcessType;
        // const sendouts = await db.sendout.getSendouts();
        const menu = menuServer.process(ctx, []);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainProcess-', error);
    } finally {
        
    }
});

serverComposer.callbackQuery(/^control:/, async (ctx: MyContext) => {
    try {
        const processName = ctx.callbackQuery?.data?.split(':')[1]!;
        const menu = menuServer.control(ctx, processName);

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainProcess-', error);
    } finally {
        
    }
});

serverComposer.use(conditionComposer);
serverComposer.use(logComposer);

export default serverComposer;