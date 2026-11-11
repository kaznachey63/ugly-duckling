import type { Result, Sendout } from "@shared/types/DataBase";
import db from '@shared/db';
import { TelegramClient } from 'telegram';
type logType = "telegram" | "db";

/**
 * Универсальный метод логирования (файлы и Telegram)
 */
export default async function logMessage(logType: logType, data: string | Result, client?: TelegramClient, sendout?: Sendout) {
    switch (logType) {
        case "telegram": {
            if (client!.connected) {
                try {
                    const topic_id =  (await db.sendout.getTopicIdBySendoutId(sendout?.id!))!;
                    await client!.sendMessage("-1003760118458", { 
                        message: data as string, 
                        replyTo: topic_id,
                        topMsgId: topic_id,
                    });                    
                } catch (err) {
                    console.error("❌ Ошибка логирования в канал:", err);
                }
            }
            break;
        }
        case "db": {
            await db.result.insert(data as Result);
            break;
        }
    }
}