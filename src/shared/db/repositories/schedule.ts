import type { Time } from '@shared/types/Time';
import { getPool } from '../pool';
const pool = getPool();
import distribution from './sendout';

/**
 * Получение графика (для рассылки)
 */
async function getSchedule(): Promise<{ id: number; cron: string }[] | undefined> {
    try {
        const { rows } = await pool.query(`SELECT id, minute, hour, day, month, week_day FROM ${distribution.getSchema()}.schedule`);
        return rows.map(r => ({
            id: r.id,
            cron: `${r.minute} ${r.hour} ${r.day} ${r.month} ${r.week_day}`
        }));
    } catch (error) {
        console.error("Ошибка при получении графика", error);
    }
}

/**
 * Получение графика (для бота)
 */
async function getScheduleForBot(schema: string): Promise<Time[] | undefined> {
    try {
        const { rows } = await pool.query(`SELECT id, minute, hour, day, month, week_day FROM ${schema}.schedule`);
        return rows.map(row => ({
            id: row.id,
            minute: row.minute,  
            hour: row.hour,
            day: row.day,
            month: row.month,
            week_day: row.week_day
        }));
    } catch (error) {
        console.error("Ошибка при получении графика", error);
        return undefined;
    }
}

/**
 * Получение времени
 */
async function getTime(schema: string, id: number): Promise<Time | undefined> {
    try {
        const { rows } = await pool.query(`SELECT minute, hour, day, month, week_day FROM ${schema}.schedule WHERE id = $1`, [id]);        
        return rows.at(0);
    } catch (error) {
        console.log("Ошибка при получении времени", error);
        return undefined;
    }
}

/**
 * Добавление времени
 */
async function addTime(schema: string, time: Time) {
    try {
        await pool.query(
            `INSERT INTO ${schema}.schedule (minute, hour, day, month, week_day)
             VALUES ($1, $2, $3, $4, $5)`,
            [time.minute, time.hour, time.day, time.month, time.week_day]
        );
    } catch (error) {
        console.log("Ошибка при добавлении времени", error);
    }
}

/**
 * Обновление времени
 */
async function updateTime(schema: string, time: Time) {
    try {
        await pool.query(
            `UPDATE ${schema}.schedule 
             SET minute = $1, hour = $2, day = $3, month = $4, week_day = $5 
             WHERE id = $6`,
            [time.minute, time.hour, time.day, time.month, time.week_day, time.id]
        );
    } catch (error) {
        console.log("Ошибка при изменении времени", error);
    }
}

/**
 * Удаление времени
 */
async function removeTime(schema: string, id: number) {
    try {
        await pool.query(`DELETE FROM ${schema}.schedule WHERE id = $1`, [id]);
    } catch (error) {
        console.log("Ошибка при удалении времени", error);
    }
}

/**
 * Очистка графика
 */
async function clearTable(schema: string) {
    try {
        await pool.query(`TRUNCATE TABLE ${schema}.schedule RESTART IDENTITY`);
    } catch (error) {
        console.error("Ошибка при очистке графика", error);
    }
}

export default {
    getSchedule,
    getScheduleForBot,
    getTime,
    removeTime,
    addTime,
    updateTime,
    clearTable
}