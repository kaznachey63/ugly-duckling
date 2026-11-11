import prisma from '@shared/db/config';
import type { Contract } from '@shared/types/DataBase';

/**
 * Получение всех договоров
 */
async function getContracts(): Promise<Contract[]> {
    return await prisma.contract.findMany({
        include: {
            user: {
                include: {
                    role: true
                }
            }
        }
    });
};

/**
 * Получение договоров на конкреного заказчика
 */
async function getContractsByUserId(userId: bigint): Promise<Contract[]> {
    try {
        return await prisma.contract.findMany({
            include: { 
                user: {
                    include: {
                        role: true
                    }
                }
            },
            where: {
                user: {
                    telegram_id: userId
                },
            }
        });
    } catch (error) {
        console.error("Ошибка при получении договоров", error);
        return [];
    }
}

/**
 * Получение договора по его айди
 */
async function getById(contractId: number): Promise<Contract | null> {
    try {
        return await prisma.contract.findFirst({
            include: { 
                user: {
                    include: {
                        role: true
                    }
                }
            },
            where: {
                id: contractId
            }
        });
    } catch (error) {
        console.error("Ошибка при получении договора", error);
        return null;
    }
}


/**
 * Удаление договора по айди
 */
async function removeById(contractId: number): Promise<boolean> {
    try {
        await prisma.contract.delete({
            where: {
                id: contractId
            }
        });
        return true;
    } catch (error) {
        console.error("Ошибка при удалении пользователя", error);
        return false;
    }
}

/**
 * Вставка договора
 */
async function insert(contract: Contract) {
    try {
        const created = await prisma.contract.create({
            data: {
                user_id: contract.user_id,
                date_start: contract.date_start,
                date_end: contract.date_end,
                price: contract.price,
                price_text: contract.price_text
            }
        });

        return created;
    } catch (error) {
        console.error("Ошибка при вставке контракта", error);
        return null;
    }
}

/**
 * Получение имен рассылок, закрепленных за договором
 */
async function getSendoutsByContractId(contractId: number): Promise<string> {
    const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: {
            sendout: {
                orderBy: { id: 'asc' },
                select: { call: true }
            }
        }
    });

    return contract?.sendout
        .map(s => s.call ?? '')
        .join(', ') ?? '';
}

export default {
    getContracts,
    getContractsByUserId,
    getById,
    removeById,
    insert,
    getSendoutsByContractId,
}