import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from '@shared/db';
import utils from 'src/common/utils';

/**
 * Обработчик выбора даты в календаре
 */
export default async function setDateListener(ctx: MyContext) {
    try {
        // Валидация данных
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
            return;
        }

        const nameDistribution = ctx.session.distribution?.name;
        const queryData = ctx.callbackQuery.data;

        // Извлечение даты из формата "calendar-YYYY-MM-DD"
        const dateMatch = queryData.match(/calendar-telegram-date-(\d{4})-(\d{2})-(\d{2})/)!;
                console.log(queryData);
        
        const [, year, month, day] = dateMatch;
        const targetDate = `${day}.${month}.${year}`;

        // Получение логов
        const logs = await db.result.getResults(nameDistribution);

        // Поиск лога по дате
        if (logs && logs.find(log => log.date === targetDate)) {
            const matchingLog = logs.find(log => log.date === targetDate)!;
            
            // Формирование кнопки "Назад" без мутации глобального объекта
            const backButton = {
                reply_markup: {
                    inline_keyboard: [[{
                        text: "🔙 Назад",
                        callback_data: `selectiveStatistika:${nameDistribution}`
                    }]]
                }
            };

            await ctx.editMessageText(
                utils.formatting.escapeMarkdown(
                    `Итог на время: ${matchingLog.time} (${matchingLog.date})\n` +
                    `Дошло в: ${matchingLog.success}\n\n` +
                    `[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Статистика → *Выборочная*]`
                ),
                {
                    parse_mode: 'MarkdownV2',
                    ...backButton
                }
            );
        } else {
            await ctx.answerCbQuery('Ещё не произошло ни одной рассылки за эту дату', { show_alert: true });
        }
    } catch (error) {
        console.error('Ошибка в обработчике setDateListener:', error);
        await ctx.answerCbQuery('Произошла ошибка при обработке запроса', { show_alert: true });
    }
}