import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/commands/cabinet/sendout/main';

const mainComposer = new Composer<MyContext>();

mainComposer.callbackQuery(/^mainDistribution:/, async (ctx: MyContext) => {
    try {
        const menu = menuSendout.mainSendout(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainDistribution:', error);
        throw error;
    } 
});

export default mainComposer;