import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuOwner from '@menus/modules/shared/sendout/owner';
import db from '@shared/db';

const ownerComposer = new Composer<MyContext>();

ownerComposer.callbackQuery(/^mainOwner:/, async (ctx: MyContext) => {
    try {    
        const user = await db.sendout.getUserOfSendout(ctx.session.sendout.id!);
        const menu = menuOwner.main(ctx, user);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainOwner:', error);
    } 
});

ownerComposer.callbackQuery(/^mainChangeOwner:/, async (ctx: MyContext) => {
    const users = await db.user.gets();
    const menu = menuOwner.change(ctx, users);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
});

ownerComposer.callbackQuery(/^mainAppointOwner:/, async (ctx: MyContext) => {
    try {    
        const userId = Number(ctx.callbackQuery?.data?.split('=')[1]);
        const user = await db.user.get(userId);
        const result = await db.sendout.changeOwner(ctx.session.sendout.id!, user?.id ?? 0);
        const menu = menuOwner.appoint(ctx, user!, result);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainOwner:', error);
    } 
});


export default ownerComposer;