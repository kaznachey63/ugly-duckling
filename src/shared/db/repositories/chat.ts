import prisma from '@shared/db/config';
import type { Chat } from '@shared/types/db';

/**
 * Вставка чатов
 */
async function insert(list: Chat[]) {
    try {
        await prisma.chat.createMany({
            data: list.map(chat => ({
                chat_id: String(chat.id),
                title: chat.title!,
                link: chat.link!
            }))
        });
    } catch (error) {
        console.error("Ошибка при вставке чатов", error);
    }
}

/**
 * Получение чатов
 */
async function get(): Promise<Chat[] | undefined> {
    try {
        return await prisma.chat.findMany();
    } catch (error) {
        console.error("Ошибка при получении чатов", error);
        return undefined;
    }
}

/**
 * Очистка списка чатов
 */
async function clear() {
    try {
        await prisma.chat.deleteMany();
        await prisma.$executeRaw`TRUNCATE TABLE public.chat RESTART IDENTITY`;
    } catch (error) {
        console.error("Ошибка при очистке чатов", error);
    }
}

export default {
    insert,
    get,
    clear
}