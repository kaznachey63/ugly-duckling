import { getPool } from '../pool';
const pool = getPool();
import type { Chat } from '@shared/types/Chat';

/**
 * Вставка чатов
 */
async function insertChats(list: Chat[]) {
    const chatIds = list.map(chat => chat.id);
    const titles = list.map(chat => chat.title);
    const links = list.map(chat => chat.link);
    try {
        await pool.query(
            `INSERT INTO public.chats (chat_id, title, link)
            SELECT * FROM UNNEST($1::TEXT[], $2::TEXT[], $3::TEXT[])`,
            [chatIds, titles, links]
        );
    } catch (error) {
        console.error("Ошибка при вставке чатов", error);
    }
}

/**
 * Получение чатов
 */
async function getChats(): Promise<Chat[] | undefined> {
    try {
        const { rows } = await pool.query(`SELECT chat_id, title, link FROM public.chats`);
        return rows.map(r => {
            return {
                id: r.chat_id,
                title: r.title,
                link: r.link,
            }
        });
    } catch (error) {
        console.error("Ошибка при получении чатов", error);
    }
}

/**
 * Очистка списка чатов
 */
async function clearTable() {
    try {
        await pool.query(`TRUNCATE TABLE public.chats RESTART IDENTITY`);
    } catch (error) {
        console.error("Ошибка при очистке чатов", error);
    }
}

async function getChatsInfo(chats: string[]): Promise<Chat[] | undefined> {
    try {
        const res = await pool.query(
            "SELECT public.get_chats_info($1) AS chats",
            [JSON.stringify(chats)]
        );

        return res.rows[0].chats;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export default {
    insertChats,
    getChats,
    getChatsInfo,
    clearTable
}