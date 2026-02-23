import type { MyContext } from '@shared/types/SessionData';
import utils from 'src/common/utils';
import db from '@shared/db';

/**
 * Обработка команды cabinet
 * @param ctx Контекст
 */
export default async function cabinet(ctx: MyContext) {
    if (!ctx) return;
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "cabinet")

        // Пользователь есть в БД
        if (await db.user.userExistsInDB(ctx.from?.id!)) {
            // Подгружаем меню
            await utils.common.loadMenu(ctx);
        }
        else { // Пользователя нет в БД, запрашиваем номер телефона
            await ctx.reply(
                "Чтобы войти в панель рассылки, необходимо поделиться со мной номером телефона\n\n" +
                "Кнопка должна появиться рядом с клавиатурой, с надписью 'ЖМИ-ЖМИ-ЖМИ'", { 
                    reply_markup: {
                        keyboard: [
                            [{ text: "ЖМИ-ЖМИ-ЖМИ", request_contact: true }]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                }
            );
        }
    } catch (error) {
        console.error("Ошибка в обработке команды cabinet: ", error);
    }
}