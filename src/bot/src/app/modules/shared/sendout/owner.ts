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
    try {
        let users = await db.user.gets();

        users = users
            .filter(u => u.role_id === 2)
            .map(u => {
                u.name ??= ctx.t("utils.shared.buttons.nameless");
                return u;
            })
        ;

        const menu = menuOwner.update(ctx, users);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainChangeOwner:', error);
    }
});

ownerComposer.callbackQuery(/^mainAppointOwner:/, async (ctx: MyContext) => {
    try {    
        const userId = Number(ctx.callbackQuery?.data?.split('=')[1]);
        const user = await db.user.get(userId);
        const result = await db.sendout.updateOwner(ctx.session.sendout.id!, user?.id ?? 0);
        const menu = menuOwner.appoint(ctx, user!, result);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainAppointOwner:', error);
    } 
});


export default ownerComposer;