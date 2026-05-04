import type { Result } from '@shared/types/DB';
import prisma from '@shared/db/config';

/**
 * Вставка результатов рассылки
 */
async function insert(result: Result) {
    try {
        await prisma.result.create({
            data: {
                success: result.success,
                chats: result.chats!, // Prisma автоматически сериализует объект в JSON
                date_time: result.date_time,
                sendout_id: result.sendout_id
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Получение результатов рассылки
 */
async function gets(sendoutId: number): Promise<Result[]> {
    return await prisma.result.findMany({
        where: { 
            sendout_id: sendoutId
        },
        orderBy: {
            date_time: 'asc'
        }
    });
}

/**
 * Получение результатов рассылки по айди результата
 */
async function getById(resultId: number): Promise<Result> {
    return (await prisma.result.findFirst({
        where: { 
            id: resultId
        }
    }))!;
}

export default {
    insert,
    gets,
    getById
};