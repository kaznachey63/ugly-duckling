import { getPool } from '../pool';
const pool = getPool();

/**
 * Получение айди последнего сообщения в списке идей
 */
async function getIdeaLastMessageId(): Promise<string> {
    const { rows } = await pool.query("SELECT last_idea_id FROM public.bot");
    return String(rows[0]?.last_idea_id);
}

/**
 * Обновление айди последнего сообщения в списке идей
 */
async function updateIdeaLastMessageId(messageId: number) {
    await pool.query(
        `UPDATE public.bot 
         SET last_idea_id = $1
         WHERE id = 1`,
        [messageId]
    );
}

export default {
    getIdeaLastMessageId,
    updateIdeaLastMessageId
}