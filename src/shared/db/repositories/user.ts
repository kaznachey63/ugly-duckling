import type { LanguageCode } from 'grammy/types';
import { getPool } from '../pool';
const pool = getPool();
import type { User } from '@shared/types/User';

/**
 * Получение данных о пользователе
 * @param value - значение для поиска (ID или телефон или тг.айди)
 */
async function getUser(value: string | bigint | number): Promise<User | undefined> {
    const typeOfValue = typeof value;
    let uniqueValue;
    switch (typeOfValue) {
        case 'string': uniqueValue = "u.phone"; break;
        case 'number': uniqueValue = "u.id"; break;
        case 'bigint': uniqueValue = "u.telegram_id"; break;
    }
    try {
        const { rows } = await pool.query(
            `SELECT 
                u.id,
                u.telegram_id as "telegramId",
                u.name,
                u.username,
                u.phone,
                u.language,
                r.code as "roleCode"
            FROM public.users u
            LEFT JOIN public.role r ON r.id = u.role_id
            WHERE ${uniqueValue} = $1`, 
            [value]
        );
        
        if (!rows[0]) return undefined;
        
        const row = rows[0];
        return {
            id: row.id,
            telegramId: row.telegramId,
            name: row.name,
            username: row.username,
            phone: row.phone,
            language: row.language,
            role: {
                code: row.roleCode
            }
        };
    } catch (error) {
        console.error("Ошибка при получении пользователя", error);
        return undefined;
    }
}

/**
 * Получение данных о пользователях
 */
async function getUsers(): Promise<User[]> {
    try {
        const query = `
            SELECT 
                u.id,
                u.telegram_id as "telegramId",
                u.name,
                u.username,
                u.phone,
                u.language,
                r.code as "roleCode"
            FROM public.users u
            LEFT JOIN public.role r ON r.id = u.role_id
        `;
        
        const { rows } = await pool.query(query);
        
        return rows.map((row) => ({
            id: row.id,
            telegramId: row.telegramId,
            name: row.name,
            username: row.username,
            phone: row.phone,
            language: row.language,
            role: {
                code: row.roleCodes
            }
        }));
    } catch (error) {
        console.error("Ошибка при получении пользователей", error);
        return [];
    }
}

/**
 * Заполнение данными пользователя, прошедшего авторизацию
 */
async function updateData(user: User) {
    try {
        await pool.query(
            `UPDATE public.users 
            SET 
                telegram_id = $1,
                name = $2, 
                username = $3,
                phone = $4,
                language = $5,
                role_id = $6
            WHERE phone = $4`,
            [user.telegramId, user.name, user.username, user.phone, user.language, user.role?.id]
        );
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
    }
}

/**
 * Вставка пользователя
 */
async function insertToDB(user: User): Promise<boolean> {
    try {
        await pool.query(
            `INSERT INTO public.users (telegram_id, name, username, phone, language, role_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [user.telegramId, user.name, user.username, user.phone, user.language, user.role?.id]
        );
        return true;
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
        return false;
    }
}

/**
 * Проверка на существование пользователя в БД
 * @returns true - если существует, иначе false
 */
async function existsInDB(userId: bigint): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT telegram_id FROM public.users WHERE telegram_id = $1",
            [userId]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Ошибка при проверке пользователя", error);
        return false;
    }
}

/**
 * Удаление пользователя из системы
 * @param value number - бд айди, бигинт - тг айди
 * 
 */
async function removeFromSystem(value: number | bigint): Promise<boolean> {
    const typeOfValue = typeof value;
    let uniqueValue;
    switch (typeOfValue) {
        case 'number': uniqueValue = "id"; break;
        case 'bigint': uniqueValue = "telegram_id"; break;
    }

    try {
        await pool.query(
            `DELETE FROM public.users WHERE ${uniqueValue} = $1`,
            [value]
        );
        return true;
    } catch (error) {
        console.error("Ошибка при удалении пользователя", error);
        return false;
    }
}

/**
 * Проверка номера телефона на существование в БД
 */
async function matchPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT id FROM public.users WHERE phone = $1",
            [phoneNumber]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Ошибка при проверке номера", error);
        return false;
    }
}

/**
 * Обновление языка пользователя
 */
async function updateLang(telegramId: bigint, languageCode: LanguageCode): Promise<boolean> {
    try {
        await pool.query(
            `UPDATE public.users 
             SET language = $1 
             WHERE telegram_id = $2`,
            [languageCode, telegramId]
        );
        return true;
    } catch (error) {
        console.error("Ошибка при обновлении языка пользователя", error);
        return false;
    }
}

async function getGroupsOfUsers(): Promise<{ customers: number[]; admins: number[] }> {
    let customers = [], admins = [];
    try {
        const users = (await pool.query("SELECT telegram_id, role_id FROM public.users")).rows;
        for (const user of users) {
            if (user.role_id == 1) admins.push(user.telegram_id);
            else if (user.role_id == 2 && user.telegram_id != 0) customers.push(user.telegram_id);
        }
    } catch (error) {
        console.log("Ошибка при получении групп пользователей", error);
    } finally {
        return { customers, admins }
    }
}

export default {
    existsInDB,
    updateLang,
    getGroupsOfUsers,
    matchPhoneNumber,
    updateData,
    removeFromSystem,
    insertToDB,
    getUser,
    getUsers
}