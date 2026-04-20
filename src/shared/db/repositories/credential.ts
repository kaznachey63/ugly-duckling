import { getPool } from '../pool';
const pool = getPool();
import type { Cred } from '@shared/types/Cred';
import type { CredRowDb } from '@shared/types/CredRowDb';

/**
 * Получение данных об аккаунтах (рассылках)
 */
async function getCredentials(): Promise<Cred[] | undefined> {
    try {
        const result = await pool.query(`SELECT schema, name, call_ru, label, api_id, api_hash, string_session FROM accounts`);
        return result.rows.map((row: CredRowDb) => ({
            schema: row.schema,
            name: row.name,
            label: row.label,
            call: row.call_ru,
            apiId: row.api_id,
            apiHash: row.api_hash,
            stringSession: row.string_session,
        }));
    } catch (error) {
        console.error("Ошибка при получении секретов", error);
        return undefined;
    }
}

export default {
    getCredentials
}