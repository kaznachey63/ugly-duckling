import { getPool } from '../pool';
const pool = getPool();
import type { Sendout } from '@shared/types/Sendout';
import type { SendoutWithCred } from '@shared/types/SendoutWithCred';
import type { SendoutWithCredRow } from '@shared/types/SendoutWithCredRow';

/**
 * Получение данных об аккаунтах (рассылках) с секретами
 */
async function getSendoutsInfoWithCredentials(): Promise<SendoutWithCred[] | undefined> {
    try {
        const result = await pool.query(`SELECT * FROM public.sendout a JOIN credentials c ON c.account_id = a.id`);
        return result.rows.map((row: SendoutWithCredRow) => ({
            schema: row.schema,
            name: row.name,
            label: row.label,
            call: row.call,
            apiId: row.api_id,
            apiHash: row.api_hash,
            stringSession: row.string_session,
        }));
    } catch (error) {
        console.error("Ошибка при получении секретов", error);
        return undefined;
    }
}

/**
 * Получение информации о рассылке по имени
 */
async function getSendoutInfo(name: string): Promise<Sendout> {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call FROM public.sendout WHERE name = $1',
        [name]
    );
    return rows[0];
}

/**
 * Получение рассылок, закрепленных за конркетным заказчиком
 */
async function getSendoutsOfUserId(userId: number): Promise<Sendout[]> {
    const { rows } = await pool.query(
        `SELECT schema, name, label, call FROM public.sendout WHERE user_id = (SELECT id FROM public.user WHERE telegram_id = $1)`,
        [userId]
    );
    return rows;
}

/**
 * Получение всех рассылок
 */
async function getAllSendouts(): Promise<Sendout[]> {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call FROM public.sendout'
    );
    return rows;
}

/**
 * Получение всех рассылок
 */
async function getSendouts(): Promise<Sendout[]> {
    const { rows } = await pool.query(
        'SELECT FROM public.sendout'
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
    getSendoutsInfoWithCredentials,
    getSendoutInfo,
    getSchema,
    getSendoutsOfUserId,
    getAllSendouts
}