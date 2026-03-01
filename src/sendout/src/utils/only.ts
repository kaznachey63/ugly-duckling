// src/distribution/helpers/sequentialLogic.ts
import type { Message } from '@shared/types/Message';

const CONFIG = {
    FIRST_CRON_ID: 1,      // 🔸 ID первой строки в БД (поменять после INSERT)
    START_MSG_OFFSET: 0,     // 🔸 2 сообщения уже ушли, стартуем с 3-го
    TOTAL_MESSAGES: 11,      // 🔸 Всего сообщений в цикле
};

export function getSequentialMessage(allMessages: Message[], scheduleId: number): Message | null {
    const runIndex = scheduleId - CONFIG.FIRST_CRON_ID;
    if (runIndex < 0) return null;

    // Вычисляем номер сообщения: ((0 + 2) % 11) + 1 = 3
    const targetMsgNumber = ((runIndex + CONFIG.START_MSG_OFFSET) % CONFIG.TOTAL_MESSAGES) + 1;

    // Ищем сообщение (проверяем оба возможных поля)
    return allMessages.find(m => m.id === targetMsgNumber || (m as any).number === targetMsgNumber) || null;
}

export default { getSequentialMessage };