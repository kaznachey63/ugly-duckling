import { getPool } from '../pool';
const pool = getPool();
import distribution from './distribution';
import type { Message } from '@shared/types/Message'
import type { IMessage } from '@shared/types/IMessage'

async function getMessages(): Promise<Message[] | undefined> {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(`SELECT id, caption, media, entities FROM ${distribution.getSchema()}.messages ORDER BY POSITION ASC`);
        return rows.map(r => ({
            id: r.id,
            caption: r.caption,
            media: r.media || [],
            entities: r.entities
        }));
    } catch (error) {
        console.error('Ошибка получения сообщений:', error);
    } finally {
        client.release();
    }
}

async function removeAllMessage(nameDistribution: string) {
    try {
        await pool.query(`TRUNCATE TABLE ${(await distribution.getDistributionInfo(nameDistribution)).schema}.messages RESTART IDENTITY`);
    } catch (error) {
        console.error("Ошибка удаления сообщений:", error);
    }
}

async function removeMessage(nameDistribution: string, messageId: number) {
    try {
        await pool.query(
            `DELETE FROM ${(await distribution.getDistributionInfo(nameDistribution)).schema}.messages 
             WHERE id = $1`,
            [messageId]
        );
    } catch (error) {
        console.error("Ошибка удаления сообщения:", error);
    }
}

async function updateMessage(
    nameDistribution: string,
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
            `UPDATE ${(await distribution.getDistributionInfo(nameDistribution)).schema}.messages 
             SET ${fields.join(', ')} 
             WHERE id = $${paramIndex}`,
            values
        );
    } catch (error) {
        console.error("Ошибка обновления сообщения:", error);
    }
}

async function addMessage(nameDistribution: string, message: IMessage) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Получаем текущее количество записей (чтобы знать позицию)
        const { rows: countRows } = await client.query(
            `SELECT COUNT(*) as cnt FROM ${(await distribution.getDistributionInfo(nameDistribution)).schema}.messages`
        );
        const position = parseInt(countRows[0].cnt);

        // 2. Добавляем сообщение с позицией
        await client.query(
            `INSERT INTO ${(await distribution.getDistributionInfo(nameDistribution)).schema}.messages (caption, media, position, entities) 
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

async function getMessagesForBot(nameDistribution: string): Promise<IMessage[] | undefined> {
    const client = await pool.connect();    
    try {
        const { rows } = await client.query(`SELECT id, caption, media, entities FROM ${(await distribution.getDistributionInfo(nameDistribution)).schema}.messages ORDER BY POSITION ASC`);
        return rows.map(r => ({
            id: r.id,
            caption: r.caption,
            media: r.media || [],
            entities: r.entities
        }));
    } catch (error) {
        console.error('Ошибка получения сообщений:', error);
    } finally {
        client.release();
    }
}

export default {
    getMessages,
    addMessage,
    updateMessage,
    removeMessage,
    getMessagesForBot,
    removeAllMessage
}