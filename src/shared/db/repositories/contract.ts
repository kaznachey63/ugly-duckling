import prisma from '@shared/db/config';
import type { Contract } from '@shared/types/db';

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
async function insert(contract: Contract): Promise<boolean> {
    try {
        await prisma.contract.create({
            data: {
                user_id: contract.user_id,
                date_start: contract.date_start,
                date_end: contract.date_start,
                price: contract.price,
            }
        });
        return true;
    } catch (error) {
        console.error("Ошибка при вставке контракта", error);
        return false;
    }
}

export default {
    getContracts,
    getContractsByUserId,
    getById,
    removeById,
    insert,
}