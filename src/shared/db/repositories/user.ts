import type { LanguageCode } from 'grammy/types';
import { getPool } from '../pool';
const pool = getPool();
import type { MyContext } from '@shared/types/SessionData';

/**
 * Проверка на существование пользователя в БД
 * @returns true - если существует, иначе false
 */
async function existsInDB(userId: number): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT telegram_id FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Ошибка при проверке пользователя", error);
        return false;
    }
}

/**
 * Получение номера телефона пользователя
 */
async function getPhoneNumber(userId: number): Promise<string> {
    try {
        const { rows } = await pool.query(
            "SELECT phone_number FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows[0]?.phone_number || "";
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
            "SELECT id FROM users WHERE phone = $1",
            [phoneNumber]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Ошибка при проверке номера", error);
        return false;
    }
}

/**
 * Заполнение данными пользователя, прошедшего авторизацию
 */
async function fillData(ctx: MyContext) {
    const { id, username, first_name, last_name, language_code } = ctx.from!;
    const phoneNumber = ctx.session?.user.phoneNumber;
    const name = last_name ? `${first_name} ${last_name}` : first_name;
    const roleId = phoneNumber == "79371807522" ? 1 : 2;

    if (!phoneNumber) return false;
    try {
        await pool.query(
            `UPDATE users 
            SET 
                telegram_id = $2,
                name = $3, 
                username = $4,
                phone = $5,
                language = $6,
                role_id = $7
            WHERE phone_number = $1`,
            [phoneNumber, id, name, username, language_code, roleId]
        );
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
    }
}
/**
 * Проверка на администратора
 */
async function userIsAdmin(userId: number): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT is_admin FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows[0]?.is_admin ?? false;
    } catch (error) {
        console.error("Ошибка при проверке на администратора", error);
        return false;
    }
}

/**
 * Вставка пользователя
 */
async function insertUserToDB(ctx: MyContext) {
    const { id, username, first_name, last_name } = ctx.from!;
    const phoneNumber = ctx.session?.user.phoneNumber || null;
    const name = last_name ? `${first_name} ${last_name}` : first_name;
    const isAdmin = ctx.session.user.role === "admin";
    const language = ctx.from?.language_code;

    if (!phoneNumber) return false;
    try {
        await pool.query(
            `INSERT INTO users (telegram_id, name, username, phone_number, is_admin, language)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, name, username, phoneNumber, isAdmin, language]
        );
        return true;
    } catch (error) {
        console.error("Ошибка при вставке пользователя", error);
    }
}

/**
 * Обновление языка пользователя
 */
async function updateLangUser(id: number, languageCode: LanguageCode) {
    try {
        await pool.query(
            `UPDATE users 
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

/**
 * Получение кода языка пользователя
 */
async function getUserLang(telegramId: number): Promise<LanguageCode> {
    try {
        const result = await pool.query(
            `SELECT language FROM users WHERE telegram_id = $1`,
            [telegramId]
        );

        // Если юзер есть и язык задан — возвращаем, иначе дефолт
        return result.rows[0]?.language;
    } catch (error) {
        console.error("Ошибка при получении языка.", error);
        return 'ru';
    }
}

async function getUsers(): Promise<{ customers: number[]; admins: number[] }> {
    let customers = [], admins = [];
    try {
        const users = (await pool.query("SELECT telegram_id, is_admin FROM users")).rows;
        for (const user of users) {
            if (user.is_admin) admins.push(user.telegram_id);
            else if (!user.is_admin && user.telegram_id != 0) customers.push(user.telegram_id);
        }
    } catch (error) {
        console.log("Ошибка в получении пользователей");
    } finally {
        return { customers, admins }
    }
}

export default {
    existsInDB,
    userIsAdmin,
    getPhoneNumber,
    insertUserToDB,
    updateLangUser,
    getUserLang,
    getUsers,
    matchPhoneNumber,
    fillData
}