import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import utils from '@utils';

const contactComposer = new Composer<MyContext>();

// ============================================================================
// ОБРАБОТЧИК: контакт (сообщение с контактом)
// ============================================================================
contactComposer.on('message:contact', async (ctx: MyContext) => {
    if (!ctx) return;
    if (!ctx.message || !('contact' in ctx.message)) return;

    try {
        const phoneNumber = ctx.message.contact.phone_number?.replace('+', '');
        if (!phoneNumber) return;

        // Проверяем номер в Google Sheets
        const dataFromSheets = await utils.google.getRowsFromGS("Заказчики!I2:I");
        const phoneExists = dataFromSheets?.some(row => row[0]?.trim() === phoneNumber);

        // 1. Сначала отправляем "Обработка..." и ПОЛУЧАЕМ ID этого сообщения
        const processingMsg = await ctx.reply(ctx.t("utils.shared.processing"), {
            reply_markup: { remove_keyboard: true }
        });
        const processingMsgId = processingMsg?.message_id;

        // 2. Логика проверки
        if (phoneExists || utils.common.isAdmin(ctx.from?.id!)) {
            ctx.session.user.phoneNumber = phoneNumber;
            ctx.session.user.role = await utils.common.getRole(ctx.from?.id!);

            // 3. Удаляем, передавая ID сообщения обработки
            await deleteMessageProcessing(ctx, processingMsgId);

            if (!await db.user.insertUserToDB(ctx)) {
                await ctx.reply(ctx.t("handlers.contact.numberIsNull"));
                return;
            }

            await utils.common.loadCabinet(ctx);
        } else {
            // 4. Если доступ запрещен — тоже удаляем
            await deleteMessageProcessing(ctx, processingMsgId);

            ctx.session.user.role = "unknown";
            await ctx.reply(ctx.t('handlers.contact.accessDenied'));
        }
    } catch (error) {
        console.error("Ошибка в обработке контакта:", error);
    }
    // ⚠️ Для message-хендлеров answerCallbackQuery не нужен
});

// ============================================================================
// 📦 ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ (внутри файла)
// ============================================================================
async function deleteMessageProcessing(ctx: MyContext, endMsgId?: number) {
    try {
        const commandId = ctx.session.state.ids.commandCabinetId;
        const targetEndId = endMsgId || ctx.msgId;
        
        // Проверки: если нет данных — выходим
        if (!commandId || !targetEndId || !ctx.chat?.id) return;

        let count = 0;
        const maxIterations = 100;

        while (commandId < targetEndId - count) {
            if (count > maxIterations) break;

            const targetId = targetEndId - count;
            if (!targetId) break;

            try {
                await ctx.api.deleteMessage(ctx.chat.id, targetId);
            } catch { }

            count += 1;
        }
    } catch { }
}

// ============================================================================
// ЭКСПОРТ
// ============================================================================
export default contactComposer;