import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuProfile from '@menus/modules/cabinet/profile/main';
import contractComposer from './contract';
import db from '@shared/db';
import authComposer from './auth';
import common from '@utils/common';

const profileComposer = new Composer<MyContext>();

profileComposer.callbackQuery(/^mainProfile/, async (ctx: MyContext) => {
    try {        
        const menu = menuProfile(ctx, await db.user.existsInDB(BigInt(ctx.from?.id!)), common.isAdmin(ctx));
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainProfile:', error);
        throw error;
    } 
});

profileComposer.use(contractComposer);
profileComposer.use(authComposer);

export default profileComposer;