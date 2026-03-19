import { TelegramClient } from "telegram";
import maps from "./maps";
import type { Chat } from '@shared/types/Chat'

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

export default {
    chatsFromClient,
    createUniqueList
};