import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuCabinet from '@menus/modules/cabinet/main';
import distributionComposer from './features/sendout'

const cabinetComposer = new Composer<MyContext>();

cabinetComposer.command('cabinet', async (ctx: MyContext) => {
    await loadCabinet(ctx);
});

cabinetComposer.callbackQuery("mainCabinet", async (ctx: MyContext) => {
    await loadCabinet(ctx);
});

/**
 * Подгрузка кабиента
 */
async function loadCabinet(ctx: MyContext) {
    const menu = menuCabinet(ctx);
    await ctx.reply(menu.text, { 
        reply_markup: menu.keyboard, 
        parse_mode: "MarkdownV2" 
    });        
}

cabinetComposer.use(distributionComposer);

export default cabinetComposer;