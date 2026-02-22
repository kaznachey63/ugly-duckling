import { getPool } from '../pool';
const pool = getPool();
import type { Chat } from '@shared/types/Chat.js';

async function insertChats(list: Chat[]) {
    const chatIds = list.map(chat => chat.id);
    const titles = list.map(chat => chat.title);
    const links = list.map(chat => chat.link);
    try {
        await pool.query(
            `INSERT INTO public.REGISTER_CHATS (chat_id, title, link)
            SELECT * FROM UNNEST($1::TEXT[], $2::TEXT[], $3::TEXT[])`,
            [chatIds, titles, links]
        );
    } catch (error) {
        console.error('Ошибка при массовой вставке чатов:', error);
    }
}

async function getChats(): Promise<Chat[] | undefined> {
    const client = await pool.connect();
    try {
        const rows = (await client.query(`SELECT chat_id, title, link FROM public.register_chats`)).rows;
        return rows.map(r => {
            return {
                id: r.chat_id,
                title: r.title,
                link: r.link,
            }
        });
    } catch (error) {
        console.error(error);
    }
    finally {
        client.release();
    }
}

async function getChatsInfo(chats: string[]) {
    try {
        const res = await pool.query(
            "SELECT public.get_chats_info($1) AS chats",
            [JSON.stringify(chats)]
        );

        return res.rows[0].chats;
    } catch (error) {
        console.error(error);
    }
}

async function clearTableChats() {
    try {
        await pool.query(`TRUNCATE TABLE public.REGISTER_CHATS RESTART IDENTITY`);
    } catch (err) {
        console.error('Ошибка при очистке таблицы чатов:', err);
    }
}

export default {
    insertChats,
    getChats,
    getChatsInfo,
    clearTableChats
}