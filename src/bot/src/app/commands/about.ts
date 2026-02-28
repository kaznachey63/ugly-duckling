import type { MyContext } from '@shared/types/SessionData';
import utils from 'src/common/utils';
import menuAbout from "@menus/commands/about";

/**
 * Обработка команды about
 */
export default async function about(ctx: MyContext) {
    try {
        const menu = menuAbout(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды about: ", error);
    }
}