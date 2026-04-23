import type { Time } from '@shared/types/Time';
import { getPool } from '../pool';
const pool = getPool();
import distribution from './sendout';

/**
 * Получение графика
 */
async function getSchedule(schemas?: string): Promise<Time[] | undefined> {
    const schema = schemas ?? distribution.getSchema();
    try {
        const { rows } = await pool.query(`SELECT id, cron, label FROM ${schema}.schedule`);
        return rows;
    } catch (error) {
        console.error("Ошибка при получении графика", error);
    }
}

/**
 * Получение времени
 */
async function getTime(schema: string, id: number): Promise<Time | undefined> {
    try {
        const { rows } = await pool.query(`SELECT id, cron, label FROM ${schema}.schedule WHERE id = $1`, [id]);        
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
            `INSERT INTO ${schema}.schedule (cron, label)
             VALUES ($1, $2)`,
            [time.cron, time.label]
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
             SET cron = $1, label = $2
             WHERE id = $3`,
            [time.cron, time.label, time.id]
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
    getTime,
    removeTime,
    addTime,
    updateTime,
    clearTable
}