import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuIdea from '@menus/modules/settings/idea';

const ideaComposer = new Composer<MyContext>();

ideaComposer.callbackQuery('mainIdea', async (ctx: MyContext) => {
    try {
        const menu = menuIdea.main(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainIdea:', error);
    } 
});

ideaComposer.callbackQuery('addIdea', async (ctx: MyContext) => {
    ctx.session.state.addingIdea = true;
    try {
        const menu = menuIdea.add(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в addIdea:', error);
    } 
});

export default ideaComposer;