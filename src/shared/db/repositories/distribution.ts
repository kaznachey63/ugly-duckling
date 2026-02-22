import { getPool } from '../pool';
const pool = getPool();
import type { InfoDist } from '@shared/types/InfoDist';

async function getDistributionInfo(name: string): Promise<InfoDist> {
    const { rows } = await pool.query(
        'SELECT schema, name, label, call_ru FROM public.register_dists WHERE name = $1',
        [name]
    );
    return rows[0];
}

function getSchema(): string | undefined {
    return process.env.SCHEMA;
}

export default {
    getDistributionInfo,
    getSchema
}