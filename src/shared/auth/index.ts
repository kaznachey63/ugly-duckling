import { TelegramClient } from 'telegram';
import prompts from 'prompts';
import type { Cred } from '@shared/types/Cred';
import { StringSession } from 'telegram/sessions';

async function start2(distribution: Cred): Promise<TelegramClient> {
    const stringSession = new StringSession(distribution.stringSession || "");

    const client = new TelegramClient(stringSession, distribution.apiId, distribution.apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => (await prompts({ type: 'text', name: 'value', message: "Введите номер телефона: " })).value,
        password: async () => {
            const res = await prompts({ type: 'text', name: 'value', message: "Введите пароль (если есть, иначе Enter): " });
            return res.value || undefined;
        },
        phoneCode: async () => (await prompts({ type: 'text', name: 'value', message: "Введите код подтверждения: " })).value,
        onError: (err: object) => console.log("Ошибка авторизации:", err),
    });
    console.log(`Успешный вход на ${distribution.call}!`);
    return client;
}

export default {
    start2
}