import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuServer from '@menus/modules/commands/panel/system/server/main';
import viewCopmoser from './view';

const serverComposer = new Composer<MyContext>();

serverComposer.callbackQuery("mainServer", async (ctx: MyContext) => {
    try {
        const menu = menuServer(ctx);
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error("Ошибка в mainServer", error);
    }
});
serverComposer.use(viewCopmoser)

export default serverComposer;