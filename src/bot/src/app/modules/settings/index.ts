import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSettings from '@menus/modules/settings/main';
import helpComposer from './features/help';
import aboutComposer from './features/about';
import ideaComposer from './features/idea';
import languageComposer from './features/language';

const settingsComposer = new Composer<MyContext>();

settingsComposer.command('settings', async (ctx: MyContext) => {
    try {
        const menu = menuSettings(ctx);
        try {
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        } catch {
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error('Ошибка в команде settings:', error);
    }
});

settingsComposer.callbackQuery('mainSettings', async (ctx: MyContext) => {
    try {
        const menu = menuSettings(ctx);
        try {
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        } catch {
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error('Ошибка в mainSettings:', error);
    } finally {
        
    }
});

settingsComposer.use(helpComposer);
settingsComposer.use(aboutComposer);
settingsComposer.use(ideaComposer);
settingsComposer.use(languageComposer);

export default settingsComposer;