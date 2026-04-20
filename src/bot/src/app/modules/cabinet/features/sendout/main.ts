import { Composer, GrammyError } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/cabinet/sendout/main';

const mainComposer = new Composer<MyContext>();

mainComposer.callbackQuery(/^mainDistribution:/, async (ctx: MyContext) => {
    try {
        // Сохраняем выбранную рассылку в сессию
        const distName = ctx.callbackQuery?.data?.split(':')[1];
        if (distName) {
            ctx.session.distribution.name = distName;
        }

        const menu = await menuSendout.mainSendout(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        if (error instanceof GrammyError && error.description?.includes('message is not modified')) {
            return;
        }
        console.error('Ошибка в mainDistribution:', error);
        throw error;
    } 
});

export default mainComposer;