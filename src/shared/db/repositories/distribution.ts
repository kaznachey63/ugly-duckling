import { getPool } from '../pool';
const pool = getPool();
import type { InfoDist } from '@shared/types/InfoDist';

/**
 * Получение информации о рассылке по имени (для бота)
 */
async function getSendoutInfo(name: string): Promise<InfoDist> {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call_ru FROM public.register_dists WHERE name = $1',
        [name]
    );
    return rows[0];
}

/**
 * Получение схемы (для рассылки)
 */
function getSchema(): string | undefined {
    return process.env.SCHEMA;
}

export default {
    getSendoutInfo,
    getSchema
}