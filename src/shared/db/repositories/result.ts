import { getPool } from '../pool';
const pool = getPool();
import distribution from './distribution';
import type { LogData } from '@shared/types/LogData';

async function insertToResults(data: LogData) {
    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO ${distribution.getSchema()}.results (time, date, success, chats) VALUES ($1, $2, $3, $4)`,
            [data.time, data.date, data.success, JSON.stringify(data.chats)]
        );
    } catch (error) {
        console.error(error);
    }
    finally {
        client.release();
    }
}

async function getResults(label: string) {
    try {
        const { rows } = await pool.query(`SELECT time, date, success, chats FROM ${(await distribution.getDistributionInfo(label)).schema}.results`);
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
    insertToResults
}