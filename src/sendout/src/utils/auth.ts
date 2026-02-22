import { TelegramClient } from 'telegram';
import prompts from 'prompts';
import log from './log';

/**
 * Метод-запуск программы и авторизация пользователя
 */
async function start(client: TelegramClient) {
    try {
        console.log("🔄 Запуск...");
        // console.log("Серверное время:", new Date().toLocaleString());
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
        await log.logMessage(client, "telegram", "✅ Программа подключилась");
    } catch (error) {
        console.error("❌ Ошибка в start():", error);
    }
}


export default {
    start
}