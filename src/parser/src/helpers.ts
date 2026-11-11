import { TelegramClient } from "telegram";
import maps from "./maps";
import type { Chat, Sendout } from '@shared/types/DataBase'
import prompts from 'prompts';
import { StringSession } from 'telegram/sessions';

function getChatLink(id: any, username: any): string {
    if (username) {
        return `https://t.me/${username}`;
    }
    // Гарантированно супергруппа (идёт с -100)
    const cleanId = id.toString().slice(4); // убираем "-100"
    return `https://t.me/c/${cleanId}/1`;
}

async function chatsFromClient(client: TelegramClient): Promise<Chat[]> {
    const dialogs = await client.getDialogs();
    // console.log(`Найдено чатов: ${dialogs.length}`);
    const safeChats = dialogs.reduce((acc: any, dialog: any) => {
        if (!dialog.id?.toString().startsWith("-100")) return acc;

        const title = (dialog.title || dialog.name || "Без названия").toLowerCase();

        // Пропускаем, если нет ключевых слов ИЛИ есть чёрные фразы
        if (!maps.INCLUDE_KEYWORDS.some((kw: any) => title.includes(kw)) ||
            maps.BLACKLIST_PHRASES.some((phrase: any) => title.includes(phrase))) {
            return acc;
        }

        acc.push({
            id: dialog.id.toString(),
            title: dialog.title || dialog.name || "Без названия",
            link: getChatLink(dialog.id, (dialog.entity as any)?.username || null)
        });
        return acc;
    }, [] as Chat[]);
    console.log(`✅ Сохранено ${safeChats.length} супергрупп`);
    return safeChats;
}

function createUniqueList(list: Chat[]): Chat[] {
    console.log(`📥 Всего чатов до удаления дублей: ${list.length}`);

    // Удаляем дубликаты по полю 'id'
    const seenIds = new Set();
    const uniqueChats: Chat[] = [];

    for (const chat of list) {
        if (typeof chat?.id !== "string") {
            console.warn("⚠️ Пропущен чат без корректного id:", chat);
            continue;
        }

        if (!seenIds.has(chat.id)) {
            seenIds.add(chat.id);
            uniqueChats.push(chat);
        }
    }

    console.log(`📤 Уникальных чатов: ${uniqueChats.length}`);
    return uniqueChats;
}

async function auth(sendout: Sendout): Promise<TelegramClient> {
    const stringSession = new StringSession(sendout.credential?.string_session || "");

    const client = new TelegramClient(stringSession, Number(sendout.credential?.api_id!), sendout.credential?.api_hash!, {
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
    console.log(`Успешный вход на ${sendout.call}!`);
    return client;
}

export default {
    chatsFromClient,
    createUniqueList,
    auth
};