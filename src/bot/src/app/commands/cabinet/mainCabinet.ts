import db from "@shared/db";
import menuCabinet from "@menus/commands/cabinet/main";
import type { MyContext } from '@shared/types/SessionData';
import common from "@utils/common";
/**
 * Обработка команды кабинет
 */
export default async function cabinet(ctx: MyContext) {
    try {
        // Удаление сообщений перед данными обработчика
        // await utils.common.deleteTwoMessages(ctx, "cabinet");

        // Пользователь есть в БД
        if (await db.user.userExistsInDB(ctx.from?.id!)) {
            // Подгружаем меню
            await common.loadCabinet(ctx);
        }
        else { // Пользователя нет в БД, запрашиваем номер телефона
            const menu = menuCabinet.notAuthed(ctx);
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error("Ошибка в обработке команды cabinet: ", error);
    }
}