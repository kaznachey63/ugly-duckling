import type { ContractRow } from '@shared/types/ContractRow';
import { getPool } from '../pool';
const pool = getPool();
import type { Contract } from '@shared/types/Contract';

/**
 * Получение договоров на конкреного заказчика
 */
async function getContractsByUser(userId: bigint): Promise<Contract[]> {
    try {
        const { rows } = await pool.query<ContractRow>(
            `SELECT c.id, c.date_start, c.date_end, c.price, c.user_id, 
                    u.name, u.telegram_id, u.username, u.phone, u.language, 
                    r.code as role_code
            FROM public.contract c 
            INNER JOIN public.users u ON c.user_id = u.id
            LEFT JOIN public.role r ON r.id = u.role_id
            WHERE u.telegram_id = $1`,
            [userId]
        );
        
        return rows.map((row) => ({
            id: row.id,
            user: {
                id: row.user_id,
                telegramId: row.telegram_id,
                name: row.name,
                username: row.username,
                phone: row.phone,
                language: row.language,
                role: {
                    code: row.role_code
                }
            },
            dateStart: row.date_start,
            dateEnd: row.date_end,
            price: row.price
        }));
    } catch (error) {
        console.error("Ошибка при получении договоров", error);
        return [];
    }
}

/**
 * Получение договора по его айди
 */
async function getContractById(id: number): Promise<Contract | null> {
    try {
        const { rows } = await pool.query<ContractRow>(
            `SELECT c.id, c.date_start, c.date_end, c.price, c.user_id, 
                    u.name, u.telegram_id, u.username, u.phone, u.language, 
                    r.code as role_code
            FROM public.contract c 
            INNER JOIN public.users u ON c.user_id = u.id
            LEFT JOIN public.role r ON r.id = u.role_id
            WHERE c.id = $1`,
            [id]
        );
        
        if (rows.length === 0) return null;
        
        return {
            id: rows[0]!.id,
            user: {
                id: rows[0]!.user_id,
                telegramId: rows[0]!.telegram_id,
                name: rows[0]!.name,
                username: rows[0]!.username,
                phone: rows[0]!.phone,
                language: rows[0]!.language,
                role: {
                    code: rows[0]!.role_code
                }
            },
            dateStart: rows[0]!.date_start,
            dateEnd: rows[0]!.date_end,
            price: rows[0]!.price
        };
    } catch (error) {
        console.error("Ошибка при получении договора", error);
        return null;
    }
}

/**
 * Получение всех договоров
 */
async function getContracts(): Promise<Contract[]> {
    try {
        const { rows } = await pool.query<ContractRow>(
            `SELECT c.id, c.date_start, c.date_end, c.price, c.user_id, 
                    u.name, u.telegram_id, u.username, u.phone, u.language, 
                    r.code as role_code
            FROM public.contract c 
            INNER JOIN public.users u ON c.user_id = u.id
            LEFT JOIN public.role r ON r.id = u.role_id`
        );
        
        return rows.map((row) => ({
            id: row.id,
            user: {
                id: row.user_id,
                telegramId: row.telegram_id,
                name: row.name,
                username: row.username,
                phone: row.phone,
                language: row.language,
                role: {
                    code: row.role_code
                }
            },
            dateStart: row.date_start,
            dateEnd: row.date_end,
            price: row.price
        }));
    } catch (error) {
        console.error("Ошибка при получении договоров", error);
        return [];
    }
}

/**
 * Удаление договора по айди
 */
async function removeContractById(contractId: number) {
    try {
        await pool.query(
            `DELETE FROM public.contract WHERE contracts = $1`,
            [contractId]
        );
        return true;
    } catch (error) {
        console.error("Ошибка при удалении пользователя", error);
        return false;
    }
}

/**
 * Вставка пользователя
 */
// async function insertToDB(contract: Contract): Promise<boolean> {
//     try {
//         await pool.query(
//             `INSERT INTO public.users (telegram_id, name, username, phone, language, role_id)
//              VALUES ($1, $2, $3, $4, $5, $6)`,
//             [user.telegramId, user.name, user.username, user.phone, user.language, user.role?.id]
//         );
//         return true;
//     } catch (error) {
//         console.error("Ошибка при вставке пользователя", error);
//         return false;
//     }
// }

export default {
    getContracts,
    getContractsByUser,
    getContractById,
    removeContractById,
    // insertToDB,
}