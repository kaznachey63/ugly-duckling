import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuView from '@menus/modules/shared/sendout/view';

const viewComposer = new Composer<MyContext>();


viewComposer.callbackQuery(/^viewSendout:/, async (ctx: MyContext) => {
    try {
        const menu = menuView(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в viewSendout:', error);
        throw error;
    } 
});

export default viewComposer;