import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuCabinet from '@menus/modules/commands/cabinet/main';

const cabinetComposer = new Composer<MyContext>();

cabinetComposer.command('cabinet', async (ctx: MyContext) => {
    const menu = menuCabinet(ctx);
        await ctx.reply(menu.text, { 
        reply_markup: menu.keyboard ?? null, 
        parse_mode: "MarkdownV2" 
    });    
});

cabinetComposer.callbackQuery("mainCabinet", async (ctx: MyContext) => {
    const menu = menuCabinet(ctx);
    await ctx.editMessageText(menu.text, { 
        reply_markup: menu.keyboard ?? null, 
        parse_mode: "MarkdownV2" 
    });    
});

export default cabinetComposer;