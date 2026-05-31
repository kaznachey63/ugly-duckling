import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuCabinet from '@menus/modules/commands/cabinet/main';
import db from '@shared/db';

const cabinetComposer = new Composer<MyContext>();

cabinetComposer.command('cabinet', async (ctx: MyContext) => {
    const menu = menuCabinet(ctx, await db.user.exists(BigInt(ctx.from?.id!)), ctx.session.isAdmin);
        await ctx.reply(menu.text, { 
        reply_markup: menu.keyboard, 
        parse_mode: "MarkdownV2" 
    });    
});

cabinetComposer.callbackQuery("mainCabinet", async (ctx: MyContext) => {
    const menu = menuCabinet(ctx, await db.user.exists(BigInt(ctx.from?.id!)), ctx.session.isAdmin);
    await ctx.editMessageText(menu.text, { 
        reply_markup: menu.keyboard, 
        parse_mode: "MarkdownV2" 
    });    
});

export default cabinetComposer;