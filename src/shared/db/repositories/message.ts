import { getPool } from '../pool';
const pool = getPool();
import distribution from './sendout';
import type { Message } from '@shared/types/Message'

/**
 * Получение сообщений 
 */
async function getMessages(schemas?: string): Promise<Message[] | undefined> {
    const schema = schemas ?? distribution.getSchema();

    try {
        const { rows } = await pool.query(`SELECT id, caption, media, entities FROM ${schema}.message ORDER BY POSITION ASC`);
        return rows.map(r => ({
            id: r.id,
            caption: r.caption,
            media: r.media || [],
            entities: r.entities
        }));
    } catch (error) {
        console.error("Ошибка при получении сообщений", error);
    }
}

/**
 * Очистка сообщений
 */
async function clearTable(schema: string) {
    try {
        await pool.query(`TRUNCATE TABLE ${schema}.message RESTART IDENTITY`);
    } catch (error) {
        console.error("Ошибка при очистке сообщений", error);
    }
}

/**
 * Удаление сообщения по айди
 */
async function removeMessage(schema: string, messageId: number) {
    try {
        await pool.query(
            `DELETE FROM ${schema}.message 
             WHERE id = $1`,
            [messageId]
        );
    } catch (error) {
        console.error("Ошибка при удалении сообщения", error);
    }
}

/**
 * Обновление сообщения по айди
 */
async function updateMessage(
    schema: string,
    messageId: number,
    updates: { caption?: string; entities?: any[] | null; media?: string[] | null }
) {
    try {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updates.caption !== undefined) {
            fields.push(`caption = $${paramIndex++}`);
            values.push(updates.caption);
        }
        if (updates.media !== undefined) {
            fields.push(`media = $${paramIndex++}`);
            values.push(JSON.stringify(updates.media)); // ← сохраняем как JSON
        }
        if (updates.entities !== undefined) {
            fields.push(`entities = $${paramIndex++}`);
            values.push(JSON.stringify(updates.entities)); // ← сохраняем как JSON
        }

        if (fields.length === 0) return; // ничего не обновляем

        values.push(messageId); // для WHERE id = $N

        await pool.query(
            `UPDATE ${schema}.message 
             SET ${fields.join(', ')} 
             WHERE id = $${paramIndex}`,
            values
        );
    } catch (error) {
        console.error("Ошибка при обновлении сообщения", error);
    }
}

/**
 * Добавление сообщения
 */
async function addMessage(schema: string, message: Message) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Получаем текущее количество записей (чтобы знать позицию)
        const { rows } = await client.query(`SELECT COUNT(*) as cnt FROM ${schema}.message`);
        const position = parseInt(rows[0].cnt);

        // 2. Добавляем сообщение с позицией
        await client.query(
            `INSERT INTO ${schema}.message (caption, media, position, entities) 
             VALUES ($1, $2, $3, $4)`,
            [message.caption, message.media, position, JSON.stringify(message.entities)]
        );

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e; // ← не теряй ошибку!
    } finally {
        client.release();
    }
}

export default {
    getMessages,
    addMessage,
    updateMessage,
    removeMessage,
    clearTable
}