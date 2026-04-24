import type { LanguageCode } from 'grammy/types';
import { getPool } from '../pool';
const pool = getPool();
import type { MyContext } from '@shared/types/SessionData';
import type { User } from '@shared/types/User';
import type { Role } from '@shared/types/Role';

/**
 * Получение данных о пользователе
 * @param value - значение для поиска (ID или телефон или тг.айди)
 */
async function getUser(value: string | bigint | number): Promise<User | undefined> {
    const typeOfValue = typeof value;
    let uniqueValue;
    switch (typeOfValue) {
        case 'string': uniqueValue = "u.phone";
        case 'number': uniqueValue = "u.id";
        case 'bigint': uniqueValue = "u.telegram_id"
    }

    try {
        console.log(            `SELECT 
                u.id
                u.telegram_id as "telegramId",
                u.name,
                u.username,
                u.phone,
                u.language,
                r.code as "role"
            FROM public.users u
            LEFT JOIN public.role r ON r.id = u.role_id
            WHERE ${uniqueValue} = $1`);
        
        const { rows } = await pool.query(
            `SELECT 
                u.id
                u.telegram_id as "telegramId",
                u.name,
                u.username,
                u.phone,
                u.language,
                r.code as "role"
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
            role: row.role
        };
    } catch (error) {
        console.error("Ошибка при получении пользователя", error);
        return undefined;
    }
}

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
                r.code as "role"
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
            role: row.role  
        }));
    } catch (error) {
        console.error("Ошибка при получении пользователей", error);
        return [];
    }
}

/**
 * Заполнение данными пользователя, прошедшего авторизацию
 */
async function updateData(ctx: MyContext) {
    const { id, username, first_name, last_name } = ctx.from!;
    const phoneNumber = ctx.session?.user.phone;
    const name = last_name ? `${first_name} ${last_name}` : first_name;
    const roleId = phoneNumber == "79371807522" ? 1 : 2;
    const language = ctx.session.user.language;

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
            [id, name, username, phoneNumber, language, roleId]
        );
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
    }
}

/**
 * Вставка пользователя
 */
async function insertToDB(data: MyContext | User): Promise<boolean> {
    let telegramId: bigint;
    let name: string;
    let username: string;
    let phone: string | null;
    let language: LanguageCode | undefined;
    let roleId: number;

    // MyContext
    if ('from' in data && data.from) {
        const ctx = data;
        telegramId = BigInt(ctx.from?.id!);
        username = ctx.from?.username! || "";
        const firstName = ctx.from?.first_name!;
        const lastName = ctx.from?.last_name!;
        name = lastName ? `${firstName} ${lastName}` : firstName;
        phone = ctx.session?.user?.phone || "";
        language = ctx.session.user.language;
        
        roleId = phone == "79371807522" ? 1 : 2;
    } 
    // User
    else {
        const user = data as User;
        telegramId = BigInt(user.telegramId);
        name = user.name;
        username = user.username;
        phone = user.phone || "";
        language = user.language;
        const roles: Record<Role, number> = {
            "admin": 1,
            "customer": 2,
            "unknown": 3
        };

        roleId = phone == "79371807522" ? 1 : roles[user.role]!;
    }

    try {
        await pool.query(
            `INSERT INTO public.users (telegram_id, name, username, phone, language, role_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [telegramId, name, username, phone, language, roleId]
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
 * @param value number - бд айди, бигинт - тг айди
 * 
 */
async function removeFromSystem(value: number | bigint): Promise<boolean> {
    const typeOfValue = typeof value;
    let uniqueValue;
    switch (typeOfValue) {
        case 'number': uniqueValue = "u.id";
        case 'bigint': uniqueValue = "u.telegram_id"
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