import { getPool } from '../pool';
const pool = getPool();
import type { Contract } from '@shared/types/Contract';

/**
 * Получение договоров на конкреного заказчика
 */
async function getContracts(userId: number): Promise<Contract[]> {
        try {
        const { rows } = await pool.query(
            `SELECT c.date_start, c.date_end, c.price, u.name as customerName
            FROM public.contracts c 
            INNER JOIN public.users u ON c.user_id = u.id
            WHERE u.telegram_id = $1`,
            [userId]
        );
        return rows!;
    } catch (error) {
        console.error("Ошибка при получении договоров", error);
        return [];
    }
}

export default {
    getContracts
}