import prisma from '@shared/db/config';
import type { Sendout, User } from '@shared/types/DataBase';

/**
 * Задание режима активности рассылки
 */
async function setModeActive(sendoutId: number, mode: boolean) {
    await prisma.sendout.update({
        where: {
            id: sendoutId
        },
        data: {
            mode_active: mode
        }
    });
}

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
 * Получение информации о рассылке по айди
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
 * Получение рассылок, закрепленных за конкретным заказчиком, и не находящихся в договорах
 */
async function getSendoutsOfUserIdAndNotInContract(userId: number): Promise<Sendout[]> {
    return await prisma.sendout.findMany({
        where: {
            user_id: userId,
            contract_id: null
        },
        
    });
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
async function updateOwner(sendoutId: number, userId: number): Promise<boolean> {
    try {
        await prisma.sendout.update({
            where: {
                id: sendoutId
            },
            data: {
                user_id: userId == 0 ? null : userId
            }
        })
        return true;
    } catch {
        return false;
    }
}

/**
 * Обновление позывного рассылки
 */
async function updateCall(sendoutId: number, call: string): Promise<boolean> {
    try {
        await prisma.sendout.update({
            where: {
                id: sendoutId
            },
            data: {
                call: call
            }
        })
        return true;
    } catch {
        return false;
    }
}

/**
 * Обновление полей у рассылок по соотв. айди
 */
async function updateManyOfIds(contractId: number, sendouts: number[]): Promise<boolean> {    
    try {
        if (sendouts.length === 0) return true;

        await prisma.sendout.updateMany({
            where: {
                id: {
                    in: sendouts
                }
            },
            data: {
                contract_id: contractId
            }
        });

        return true;
    } catch (error) {
        console.error("Ошибка при обновлении рассылок", error);
        return false;
    }
}

/**
 * Смена режима тестирования
 */
async function setModeTest(sendoutId: number, mode: boolean) {
    const row = await prisma.general.findFirst({
        select: { id: true }
    });
    if (!row) return;

    await prisma.sendout.update({
        where: { 
            id: sendoutId 
        },
        data: {
            mode_test: mode
        }
    });
}

export default {
    getSendoutsInfoWithCredentials,
    getSendoutInfo,
    getSendoutsOfUserId,
    getSendouts,
    getTopicIdBySendoutId,
    getUserOfSendout,
    updateOwner,
    updateCall,
    updateManyOfIds,
    getSendoutsOfUserIdAndNotInContract,
    setModeActive,
    setModeTest,
};