import type { MyContext } from '@shared/types/SessionData';
import utils from 'src/common/utils';
import menuHelp from "@menus/commands/help";

/**
 * Обработка команды help
 */
export default async function help(ctx: MyContext) {
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "help");

        const menu = menuHelp(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды help:", error);
    }
}