import { TelegramClient } from 'telegram';
import prompts from 'prompts';
import { StringSession } from 'telegram/sessions';
import type { SendoutWithCred } from '@shared/types/SendoutWithCred';
import type { Sendout } from '@shared/types/db';

async function start2(distribution: Sendout): Promise<TelegramClient> {
    const stringSession = new StringSession(distribution.credential?.string_session || "");

    const client = new TelegramClient(stringSession, Number(distribution.credential?.api_id!), distribution.credential?.api_hash!, {
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