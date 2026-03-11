import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuAbout from '@menus/modules/settings/about';

const aboutComposer = new Composer<MyContext>();

aboutComposer.callbackQuery('mainAbout', async (ctx: MyContext) => {
    try {
        const menu = menuAbout(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainAbout:', error);
    } finally {
        
    }
});

export default aboutComposer;