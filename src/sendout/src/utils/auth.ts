import { TelegramClient } from 'telegram';
import prompts from 'prompts';
import logMessage from './log';
import type { Sendout } from '@shared/types/DataBase';

/**
 * Метод-запуск программы и авторизация пользователя
 */
async function start(client: TelegramClient, sendout: Sendout) {
    try {
        console.log("🔄 Запуск...");

        if (!client.connected) {
            await client.connect();
        }

        if (!await client.checkAuthorization()) {
            await client.start({
                phoneNumber: async () => (await prompts({ type: 'text', name: 'value', message: "Введите номер телефона: " })).value,
                password: async () => {
                    const res = await prompts({ type: 'text', name: 'value', message: "Введите пароль (если есть, иначе Enter): " });
                    return res.value || undefined;
                },
                phoneCode: async () => (await prompts({ type: 'text', name: 'value', message: "Введите код подтверждения: " })).value,
                onError: (err: object) => console.log("Ошибка авторизации:", err),
            });

            console.log("Сохраненная сессия:", client.session.save());
        }
        await logMessage("telegram", "✅ Рассылка подключилась", client, sendout);
    } catch (error) {
        console.error("❌ Ошибка в start():", error);
    }
}

export default {
    start
}