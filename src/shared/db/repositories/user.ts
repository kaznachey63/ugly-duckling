import type { LanguageCode } from 'grammy/types';
import { getPool } from '../pool';
const pool = getPool();
import type { MyContext } from '@shared/types/SessionData';

/**
 * Проверка на существование пользователя в БД
 * @param userId Айди пользователя
 * @returns true - если существует, иначе false
 */
async function userExistsInDB(userId: number): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT telegram_id FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Ошибка проверки пользователя:", error);
        return false;
    }
}

/**
 * Получение номера телефона пользователя из БД
 * @param userId Айди пользователя
 * @returns Номер телефона или пустая строка
 */
async function getPhoneNumber(userId: number): Promise<string> {
    try {
        const { rows } = await pool.query(
            "SELECT phone_number FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows[0]?.phone_number || "";
    } catch (error) {
        console.error("Ошибка получения номера из БД:", error);
        return "";
    }
}

/**
 * Проверка на администратора
 * @param userId Айди пользователя
 * @returns true если админ, иначе false
 */
async function userIsAdmin(userId: number): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT is_admin FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows[0]?.is_admin ?? false;
    } catch (error) {
        console.error("Ошибка проверки администратора:", error);
        return false;
    }
}

/**
 * Проверка на батю
 * @param userId Айди пользователя
 * @returns true если номер совпадает с FATHER_NUMBER, иначе false
 */
async function userIsFather(userId: number): Promise<boolean> {
    try {
        const { rows } = await pool.query(
            "SELECT phone_number FROM users WHERE telegram_id = $1",
            [userId]
        );
        return rows[0]?.phone_number === process.env.FATHER_NUMBER;
    } catch (error) {
        console.error("Ошибка проверки батя:", error);
        return false;
    }
}

/**
 * Вставка пользователя в БД
 * @param ctx Контекст
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
            VALUES ($1, $2, $3, $4, $5)`,
            [id, name, username, phoneNumber, isAdmin, language]
        );
        return true;
    } catch (error) {
        console.error("Ошибка вставки пользователя:", error);
    }
}

/**
 * Обновляет язык пользователя в БД по telegram_id
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
        console.error("Ошибка обновления языка пользователя:", error);
        return false;
    }
}


async function getUserLang(telegramId: number): Promise<LanguageCode> {
    try {
        const result = await pool.query(
            `SELECT language FROM users WHERE telegram_id = $1`,
            [telegramId]
        );

        // Если юзер есть и язык задан — возвращаем, иначе дефолт
        return result.rows[0]?.language;
    } catch (error) {
        console.error("Ошибка получения языка:", error);
        return 'ru';
    }
}

export default {
    userExistsInDB,
    userIsAdmin,
    userIsFather,
    getPhoneNumber,
    insertUserToDB,
    updateLangUser,
    getUserLang
}