import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuHelp from '@menus/modules/commands/settings/help';

const helpComposer = new Composer<MyContext>();

helpComposer.callbackQuery('mainHelp', async (ctx: MyContext) => {
    try {
        const menu = menuHelp(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainHelp:', error);
    } finally {
        
    }
});

export default helpComposer;