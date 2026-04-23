import type { LanguageCode } from 'grammy/types';
import { getPool } from '../pool';
const pool = getPool();
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/User';

/**
 * Получение данных о пользователе
 * @param value - значение для поиска (ID или телефон)
 * @param searchById - true = поиск по telegram_id, false = поиск по phone
 */
async function getUser(value: string | number, searchById: boolean): Promise<User | undefined> {
    try {
        const searchField = searchById ? 'u.telegram_id' : 'u.phone';
        const query = `
            SELECT 
                u.telegram_id as "telegramId",
                u.name,
                u.username,
                u.phone,
                u.language,
                r.id as "role_id",
                r.name_ru as "role_nameRu",
                r.name_en as "role_nameEn"
            FROM public.users u
            LEFT JOIN public.role r ON r.id = u.role_id
            WHERE ${searchField} = $1
        `;
        
        const { rows } = await pool.query(query, [value]);
        
        if (!rows[0]) return undefined;
        
        const row = rows[0];
        return {
            telegramId: row.telegramId,
            name: row.name,
            username: row.username,
            phone: row.phone,
            language: row.language,
            role: {
                id: row.role_id,
                nameRu: row.role_nameRu,
                nameEn: row.role_nameEn
            }
        };
    } catch (error) {
        console.error("Ошибка при получении пользователя", error);
        return undefined;
    }
}

/**
 * Заполнение данными пользователя, прошедшего авторизацию
 */
async function updateData(ctx: MyContext) {
    const { id, username, first_name, last_name, language_code } = ctx.from!;
    const phoneNumber = ctx.session?.user.phone;
    const name = last_name ? `${first_name} ${last_name}` : first_name;
    // const roleId = phoneNumber == "79371807522" ? 1 : 2;
    const roleId = 2;

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
            [id, name, username, phoneNumber, language_code, roleId]
        );
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
    }
}

/**
 * Вставка пользователя
 */
async function insertToDB(ctx: MyContext) {
    const { id, username, first_name, last_name } = ctx.from!;
    const phoneNumber = ctx.session?.user.phone || null;
    const name = last_name ? `${first_name} ${last_name}` : first_name;
    // const roleId = phoneNumber == "79371807522" ? 1 : 2;
    const roleId = 2;
    const language = ctx.from?.language_code;

    try {
        await pool.query(
            `INSERT INTO public.users (telegram_id, name, username, phone, language, role_id)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, name, username, phoneNumber, language, roleId]
        );
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
    }
}

/**
 * Проверка на существование пользователя в БД
 * @returns true - если существует, иначе false
 */
async function existsInDB(userId: number): Promise<boolean> {
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
 */
async function removeFromSystem(userId: number): Promise<boolean> {
    try {
        const { rowCount }  = await pool.query(
            "DELETE FROM public.users WHERE telegram_id = $1",
            [userId]
        );
        return rowCount! > 0;
    } catch (error) {
        console.error("Ошибка при удалении пользователя", error);
        return false;
    }
}

/**
 * Получение номера телефона пользователя
 */
async function getPhoneNumber(userId: number): Promise<string> {
    try {
        const { rows } = await pool.query(
            "SELECT phone FROM public.users WHERE telegram_id = $1",
            [userId]
        );
        return rows[0]?.phone || "";
    } catch (error) {
        console.error("Ошибка при получении номера", error);
        return "";
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
async function updateLang(id: number, languageCode: LanguageCode) {
    try {
        await pool.query(
            `UPDATE public.users 
             SET language = $1 
             WHERE telegram_id = $2`,
            [languageCode, id]
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

async function getUsers(): Promise<User[]> {
    try {
        const { rows } = await pool.query("SELECT * FROM public.users");
        return rows;
    } catch (error) {
        console.log("Ошибка при получении пользователей", error);
        return [];
    }
}

export default {
    existsInDB,
    getPhoneNumber,
    updateLang,
    getGroupsOfUsers,
    matchPhoneNumber,
    updateData,
    removeFromSystem,
    insertToDB,
    getUser,
    getUsers
}