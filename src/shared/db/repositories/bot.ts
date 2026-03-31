import { getPool } from '../pool';
const pool = getPool();

async function getLastMessage() {
    const { rows } = await pool.query("SELECT last_idea_id FROM public.bot");
    return rows[0];
}

async function updateLastMessageId(messageId: number) {
    await pool.query(
        `UPDATE public.bot 
         SET last_idea_id = $1
         WHERE id = 1`,
        [messageId]
    );
}

export default {
    getLastMessage,
    updateLastMessageId
}