import prisma from '@shared/db/config';
import type { Sendout, User } from '@shared/types/DB';

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
 * Получение айди темы для лога телеграм по айди рассылки
 */
async function getTopicIdBySendoutId(sendoutId: number): Promise<number | null> {
    return (await prisma.sendout.findFirst({
        where: {
            id: sendoutId
        },
        select: {
            telegram_topic_id: true
        }
    }))?.telegram_topic_id!;
}

/**
 * Получение заказчика по айди рассылки
 */
async function getUserOfSendout(sendoutId: number):Promise<User | undefined> {
    return (await prisma.sendout.findFirst({
        where: {
            id: sendoutId
        },
        select: {
            user: true
        }
    }))?.user ?? undefined;
}

/**
 * Смена владельца рассылки
 */
async function changeOwner(sendoutId: number, userId: number): Promise<boolean> {
    try {
        await prisma.sendout.update({
            where: {
                id: sendoutId
            },
            data: {
                user_id: userId
            }
        })
        return true;
    } catch {
        return false;
    }
}

export default {
    getSendoutsInfoWithCredentials,
    getSendoutInfo,
    getSendoutsOfUserId,
    getSendouts,
    getTopicIdBySendoutId,
    getUserOfSendout,
    changeOwner
};