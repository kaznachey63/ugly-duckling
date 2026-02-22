import { getPool } from '../pool';
const pool = getPool();
import type { Cred } from '@shared/types/Cred';
import type { CredRowDb } from '@shared/types/CredRowDb';

// 💬 Получение секретов и рассылок
async function getCredentials(): Promise<Cred[]> {
    const queryText =
        `SELECT r.schema, r.name, r.call_ru, r.label, c.api_id, c.api_hash, c.string_session
        FROM credentials c 
        JOIN register_dists r ON c.register_dists_id = r.id`
        ;
    try {
        const result = await pool.query(queryText);
        return result.rows.map((row: CredRowDb) => ({
            schema: row.schema,
            name: row.name,
            call: row.call_ru,
            apiId: row.api_id,
            apiHash: row.api_hash,
            stringSession: row.string_session,
            label: row.label
        }));
    }
    finally { }
}

// 💬 Получение секретов и рассылок (глобально, без схемы)
async function getCred(): Promise<Cred[]> {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(
            'SELECT r.schema, r.name, r.call_ru, r.label, c.api_id, c.api_hash, c.string_session ' +
            'FROM credentials c ' +
            'JOIN register_dists r ON c.register_dists_id = r.id'
        );
        return rows.map(row => ({
            schema: row.schema,
            name: row.name,
            call: row.call_ru,
            apiId: row.api_id,
            apiHash: row.api_hash,
            stringSession: row.string_session,
            label: row.label
        }));
    } finally {
        client.release();
    }

}

export default {
    getCredentials,
    getCred
}