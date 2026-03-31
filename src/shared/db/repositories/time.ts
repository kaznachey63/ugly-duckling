import type { Time } from '@shared/types/Time';
import { getPool } from '../pool';
const pool = getPool();
import distribution from './distribution';

async function getTimes(): Promise<{ id: number; cron: string }[] | undefined> {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(
            // 👇 Добавляем id в SELECT
            `SELECT id, minute, hour, day, month, week_day FROM ${distribution.getSchema()}.cron_times`
        );
        // 👇 Возвращаем объект { id, cron }
        return rows.map(r => ({
            id: r.id,
            cron: `${r.minute} ${r.hour} ${r.day} ${r.month} ${r.week_day}`
        }));
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}

async function getTimesForBot(schema: string): Promise<Time[] | undefined> {
    try {
        const { rows } = await pool.query(
            `SELECT id, minute, hour, day, month, week_day FROM ${schema}.cron_times`
        );

        return rows.map(row => ({
            id: row.id,
            minute: row.minute,  
            hour: row.hour,
            day: row.day,
            month: row.month,
            week_day: row.week_day
        }));
    } catch (error) {
        console.error('Ошибка при получении времён:', error);
        return undefined;
    }
}

async function addTime(schema: string, time: Time) {
    try {
        await pool.query(
            `INSERT INTO ${schema}.cron_times (minute, hour, day, month, week_day)
             VALUES ($1, $2, $3, $4, $5)`,
            [time.minute, time.hour, time.day, time.month, time.week_day]
        );
    } catch {
        console.log("Ошибка при добавлении времени в БД");
    }
}

async function updateTime(schema: string, time: Time) {
    try {
        await pool.query(
            `UPDATE ${schema}.cron_times 
             SET minute = $1, hour = $2, day = $3, month = $4, week_day = $5 
             WHERE id = $6`,
            [time.minute, time.hour, time.day, time.month, time.week_day, time.id]
        );
    } catch {
        console.log("Ошибка при изменении времени в БД");
    }
}

async function getTime(schema: string, id: number) {
    try {
        const { rows } = await pool.query(`SELECT minute, hour, day, month, week_day FROM ${schema}.cron_times 
            WHERE id = $1`,
            [id]
        );        
        return rows.at(0);
    } catch {
        console.log("Ошибка при получении времени из БД");
    }
}

async function removeTime(schema: string, id: number) {
    try {
        await pool.query(`DELETE FROM ${schema}.cron_times
            WHERE id = $1`,
            [id]
        );
    } catch (e) {
        console.log("Ошибка при удалении времени из БД", e);
    }
}

async function clearTableTimes(schema: string) {
    try {
        await pool.query(`TRUNCATE TABLE ${schema}.cron_times RESTART IDENTITY`);
    } catch (err) {
        console.error('Ошибка при очистке таблицы времен:', err);
    }
}

export default {
    getTimes,
    getTimesForBot,
    getTime,
    removeTime,
    addTime,
    updateTime,
    clearTableTimes
}