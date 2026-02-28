import type { MyContext } from '@shared/types/SessionData';
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
        // Удаляем контакт пользователя
        try { await ctx.deleteMessage(); } catch { }        
        
        // Сообщение "Обработка..."
        await ctx.reply(ctx.t("utils.shared.processing"), { reply_markup: { remove_keyboard: true }});

        // Достаём номер телефона
        const phoneNumber = ctx.message?.contact.phone_number.replace('+', '');

        // Проверяем номер в Google Sheets
        const dataFromSheets = await utils.google.getRowsFromGS("Заказчики!I2:I");
        const phoneExists = dataFromSheets?.some(row => row[0]?.trim() === phoneNumber);

        // Если номер найден в реестре заказчиков (гугл-таблице)
        if (phoneExists || phoneNumber === process.env.ADMIN_NUMBER) {
            ctx.session.user.phoneNumber = phoneNumber;

            // Добавляем пользователя в БД
            await db.user.insertUserToDB(ctx);

            // Удаляем обработку
            try { await ctx.deleteMessage(); } catch{ }

            // Подгружаем меню
            await utils.common.loadCabinet(ctx);
        }
        else { // Если номер не найден
            await ctx.reply(ctx.t('handlers.contact.accessDenied'));
        }
    } catch (error) {
        console.error("Ошибка в обработке контакта:", error);
    }
}