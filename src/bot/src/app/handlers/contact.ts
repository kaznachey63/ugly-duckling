import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from '@shared/db';
import utils from 'src/common/utils';

/**
 * Обработчик контакта
 * @param ctx Контекст
 */
export default async function contact(ctx: MyContext) {
    if (!ctx) return;
    if (!ctx.message || !('contact' in ctx.message)) return;

    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "contact")
        
        // Сообщение "Обработка..."
        await ctx.reply("Обработка...", Markup.removeKeyboard());

        // Достаём номер телефона
        const phoneNumber = ctx.message?.contact.phone_number.replace('+', '');

        // Проверяем номер в Google Sheets
        const dataFromSheets = await utils.google.getRowsFromGS("Заказчики!I2:I");
        const phoneExists = dataFromSheets?.some(row => row[0]?.trim() === phoneNumber);

        // Если номер найден в реестре заказчиков (гугл-таблице)
        if (phoneExists || phoneNumber === process.env.ADMIN_NUMBER) {
            ctx.session.phoneNumber = phoneNumber;

            // Добавляем пользователя в БД
            await db.user.insertUserToDB(ctx);

            // Удаляем обработку
            try {
                await ctx.deleteMessage(ctx.message?.message_id! + 1);
            } catch (error) { }

            // Подгружаем меню
            await utils.common.loadMenu(ctx);
        }
        else { // Если номер не найден
            await ctx.reply("Отказано в доступе.\nЧтобы оставить заявку на продукт, воспользуйтесь командной '/form'");
        }
    } catch (error) {
        console.error("Ошибка в обработке контакта:", error);
    }
}