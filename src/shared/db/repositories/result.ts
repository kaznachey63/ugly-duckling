import { getPool } from '../pool';
const pool = getPool();
import distribution from './sendout';
import type { LogData } from '@shared/types/LogData';

/**
 * Вставка результатов рассылки
 */
async function insertResult(data: LogData) {
    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO ${distribution.getSchema()}.result (time, date, success, chats) VALUES ($1, $2, $3, $4)`,
            [data.time, data.date, data.success, JSON.stringify(data.chats)]
        );
    } catch (error) {
        console.error(error);
    }
    finally {
        client.release();
    }
}

/**
 * Получение результатов рассылки
 */
async function getResults(schema: string) {
    try {
        const { rows } = await pool.query(`SELECT time, date, success, chats FROM ${schema}.result`);
        return rows.map(r => {
            return {
                time: r.time,
                date: r.date,
                success: r.success,
                chats: r.chats
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export default {
    getResults,
    insertResult
}