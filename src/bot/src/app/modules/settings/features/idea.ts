import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuIdea from '@menus/modules/settings/about';

const ideaComposer = new Composer<MyContext>();

ideaComposer.callbackQuery('mainAbout', async (ctx: MyContext) => {
    try {
        const menu = menuIdea(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainIdea:', error);
    } finally {
        
    }
});

export default ideaComposer;