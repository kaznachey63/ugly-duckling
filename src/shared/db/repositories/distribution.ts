import { getPool } from '../pool';
const pool = getPool();
import type { InfoDist } from '@shared/types/InfoDist';

/**
 * Получение информации о рассылке по имени
 */
async function getSendoutInfo(name: string): Promise<InfoDist> {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call_ru FROM public.accounts WHERE name = $1',
        [name]
    );
    return rows[0];
}

/**
 * Получение рассылок, закрепленных за конркетными заказчиком
 */
async function getSendoutsOfUserId(userId: number) {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call_ru FROM public.accounts WHERE user_id = $1',
        [userId]
    );
    return rows;
}

/**
 * Получение всех рассылок
 */
async function getAllSendouts() {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call_ru FROM public.accounts'
    );
    return rows;
}

/**
 * Получение схемы (для рассылки)
 */
function getSchema(): string | undefined {
    return process.env.SCHEMA;
}

export default {
    getSendoutInfo,
    getSchema,
    getSendoutsOfUserId,
    getAllSendouts
}