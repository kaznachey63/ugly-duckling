import prisma from '@shared/db/config';
import type { AuthLimit } from '@shared/types/DB';

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
 * Получение информации о пользователе в списках авторизации по телеграм айди
 */
async function get(telegramId: number): Promise<AuthLimit[] | undefined> {
    try {
        return await prisma.auth_limit.findFirst({
            where: {
                telegram_id: telegramId
            }
        });
    } catch {
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
    clear,
}