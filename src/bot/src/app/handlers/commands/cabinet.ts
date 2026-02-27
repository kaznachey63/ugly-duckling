import type { MyContext } from '@shared/types/SessionData';
import utils from 'src/common/utils';
import db from '@shared/db';
import menuCabinet from "@menus/handlers/commands/cabinet";

/**
 * Обработка команды cabinet
 */
export default async function cabinet(ctx: MyContext) {
    if (!ctx) return;
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "cabinet");

        // Пользователь есть в БД
        if (await db.user.userExistsInDB(ctx.from?.id!)) {
            // Подгружаем меню
            await utils.common.loadMenu(ctx);
        }
        else { // Пользователя нет в БД, запрашиваем номер телефона
            const menu = menuCabinet(ctx);
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error("Ошибка в обработке команды cabinet: ", error);
    }
}