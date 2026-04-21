import { getPool } from '../pool';
const pool = getPool();
import type { SendoutInfo } from '@shared/types/SendoutInfo';
import type { SendoutInfoWithCred } from '@shared/types/SendoutInfoWithCred';
import type { SendoutInfoWithCredRow } from '@shared/types/SendoutInfoWithCredRow';

/**
 * Получение данных об аккаунтах (рассылках) с секретами
 */
async function getSendoutsInfoWithCredentials(): Promise<SendoutInfoWithCred[] | undefined> {
    try {
        const result = await pool.query(`SELECT * FROM accounts a JOIN credentials c ON c.account_id = a.id`);
        return result.rows.map((row: SendoutInfoWithCredRow) => ({
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
async function getSendoutInfo(name: string): Promise<SendoutInfo> {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call FROM public.accounts WHERE name = $1',
        [name]
    );
    return rows[0];
}

/**
 * Получение рассылок, закрепленных за конркетными заказчиком
 */
async function getSendoutsOfUserId(userId: number) {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call FROM public.accounts WHERE user_id = $1',
        [userId]
    );
    return rows;
}

/**
 * Получение всех рассылок
 */
async function getAllSendouts() {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call FROM public.accounts'
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