import { getPool } from '../pool';
const pool = getPool();
import type { Cred } from '@shared/types/Cred';
import type { CredRowDb } from '@shared/types/CredRowDb';

async function getLastMessage() {
    const { rows } = await pool.query("SELECT last_idea_id FROM public.bot");
    return rows[0];
}

async function updateLastMessageId(messageId: number) {
    await pool.query(
        `UPDATE public.bot 
        SET last_idea_id = $1
        WHERE id = $2`,
        [messageId, (await getLastMessage()).id]
    );
}

export default {
    getLastMessage,
    updateLastMessageId
}