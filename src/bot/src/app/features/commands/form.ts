import type { MyContext, SessionData } from '@shared/types/SessionData';
import utils from 'src/common/utils';
import menuForm from "@menus/commands/form";

/**
 * Обработка команды form
 */
export default async function form(ctx: MyContext) {
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "form");
        
        const menu = menuForm(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды form: ", error);
    }
}