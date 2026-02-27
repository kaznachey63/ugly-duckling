import type { MyContext } from '@shared/types/SessionData';
import utils from 'src/common/utils';
import menuSettings from "@menus/commands/settings/main";

/**
 * Обработка команды settings
 */
export default async function settings(ctx: MyContext) {
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "settings");

        const menu = menuSettings(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в обработке команды settings:", error);
    }
}