import prisma from '@shared/db/config';
import type { Sendout } from '@shared/types/DB';

/**
 * Получение данных о рассылках с секретами
 */
async function getSendoutsInfoWithCredentials(): Promise<Sendout[] | undefined> {
    try {
        return await prisma.sendout.findMany({
            include: {
                credential: true
            }
        });
    } catch (error) {
        console.error("Ошибка при получении секретов", error);
        return undefined;
    }
}

/**
 * Получение информации о рассылке по имени
 */
async function getSendoutInfo(sendoutId: number): Promise<Sendout | undefined> {
    try {
        return await prisma.sendout.findFirst({
            where: {
                id: sendoutId
            }
        }) ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Получение рассылок, закрепленных за конкретным заказчиком
 */
async function getSendoutsOfUserId(userId: bigint): Promise<Sendout[]> {
    try {
        return await prisma.sendout.findMany({
            where: {
                user: {
                    telegram_id: userId
                }
            }
        });
    } catch (error) {
        console.error("Ошибка при получении рассылок", error);
        return [];
    }
}

/**
 * Получение всех рассылок
 */
async function getSendouts(): Promise<Sendout[]> {
    try {
        return await prisma.sendout.findMany();
    } catch (error) {
        console.error("Ошибка при получении рассылок", error);
        return [];
    }
}

/**
 * Получение схемы (для рассылки)
 */
function getSchema(): string | undefined {
    return process.env.SCHEMA;
}

export default {
    getSendoutsInfoWithCredentials,
    getSendoutInfo,
    getSchema,
    getSendoutsOfUserId,
    getSendouts
};