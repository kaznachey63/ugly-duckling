import type { LogData } from '@shared/types/LogData';
import db from '@shared/db';
import { TelegramClient } from 'telegram';

/**
 * Универсальный метод логирования (файлы и Telegram)
 */
async function logMessage(client: TelegramClient, logType: string, logData: string | LogData) {
    switch (logType) {
        case "telegram": {
            if (client.connected) {
                try {
                    await client.sendMessage("@minet_ru", { message: logData as string });
                } catch (err) {
                    console.error("❌ Ошибка логирования в канал:", err);
                }
            }
            break;
        }
        case "json": {
            await db.result.insertResult(logData as LogData);
            break;
        }
    }
}

export default {
    logMessage
}