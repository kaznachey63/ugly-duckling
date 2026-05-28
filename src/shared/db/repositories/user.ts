import prisma from '@shared/db/config';
import type { User, UserIds } from '@shared/types/DB';
import type { LanguagesALlowed } from '@shared/types/LanguagesAllowed';

/**
 * Получение массива ID пользователей
 */
async function getIds(): Promise<UserIds[]> {
    return prisma.user.findMany({
        select: { id: true }
    });
}

/**
 * Получение данных о пользователе
 * @param value - значение для поиска (ID или телефон или тг.айди)
 */
async function get(value: string | bigint | number): Promise<User | undefined> {
    const typeOfValue = typeof value;
    let whereField: string;
    switch (typeOfValue) {
        case 'string': whereField = 'phone'; break;
        case 'number': whereField = 'id'; break;
        case 'bigint': whereField = 'telegram_id'; break;
    }
    try {
        const result = await prisma.user.findFirst({
            where: {
                [whereField!]: value
            },
            include: {
                role: true
            }
        });
        return result ? result : undefined;
    } catch (error) {
        console.error("Ошибка при получении пользователя", error);
        return undefined;
    }
}

/**
 * Получение данных о пользователях
 */
async function gets(): Promise<User[]> {
    try {
        return await prisma.user.findMany({
            include: {
                role: true
            }
        });
    } catch (error) {
        console.error("Ошибка при получении пользователей", error);
        return [];
    }
}

/**
 * Заполнение данными пользователя, прошедшего авторизацию
 */
async function update(user: User) {
    try {
        await prisma.user.updateMany({
            where: {
                phone: user.phone
            },
            data: {
                telegram_id: user.telegram_id,
                name: user.name,
                username: user.username,
                phone: user.phone,
                language: user.language,
                role_id: user.role?.id
            }
        });
    } catch (error) {
        console.error("Ошибка при обновлении пользователя", error);
    }
}

/**
 * Вставка пользователя
 */
async function insert(user: User): Promise<boolean> {
    try {
        await prisma.user.create({
            data: {
                telegram_id: user.telegram_id,
                name: user.name,
                username: user.username,
                phone: user.phone,
                language: user.language,
                role_id: user.role?.id
            }
        });
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
async function exists(userId: bigint): Promise<boolean> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                telegram_id: userId
            },
            select: {
                telegram_id: true
            }
        });
        return user !== null;
    } catch (error) {
        console.error("Ошибка при проверке пользователя", error);
        return false;
    }
}

/**
 * Удаление пользователя из системы
 * @param value number - бд айди, бигинт - тг айди
 */
async function removeFromSystem(value: number | bigint): Promise<boolean> {
    const typeOfValue = typeof value;
    let whereField: string;

    switch (typeOfValue) {
        case 'number': whereField = 'id'; break;
        case 'bigint': whereField = 'telegram_id'; break;
    }

    try {
        await prisma.user.deleteMany({
            where: {
                [whereField!]: value
            }
        });

        let telegramId: bigint | null = null;

        if (typeOfValue == 'bigint') {
            telegramId = value as bigint;
        }
        else {
            const user = await prisma.user.findFirst({
                where: {
                    id: value as number
                }
            });

            telegramId = user?.telegram_id ?? null;
        }

        if (telegramId) {
            await prisma.auth_limit.delete({
                where: {
                    telegram_id: telegramId
                }
            });
        }

        return true;
    } catch (error) {
        console.error("Ошибка при удалении пользователя", error);
        return false;
    }
}

/**
 * Проверка номера телефона на существование в БД
 */
async function matchPhoneNumber(phoneNumberHashed: string): Promise<boolean> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                phone: phoneNumberHashed
            },
            select: {
                id: true
            }
        });
        return user !== null;
    } catch (error) {
        return false;
    }
}

/**
 * Обновление языка пользователя
 */
async function updateLang(telegramId: bigint, languageCode: LanguagesALlowed): Promise<boolean> {
    try {
        await prisma.user.updateMany({
            where: {
                telegram_id: telegramId
            },
            data: {
                language: languageCode
            }
        });
        return true;
    } catch (error) {
        console.error("Ошибка при обновлении языка пользователя", error);
        return false;
    }
}

/**
 * Обновление роли пользователя
 */
async function updateRole(userId: number, roleId: number): Promise<boolean> {
    try {
        await prisma.user.updateMany({
            where: {
                id: userId
            },
            data: {
                role_id: roleId
            }
        });
        return true;
    } catch (error) {
        console.error("Ошибка при обновлении роли пользователя", error);
        return false;
    }
}

export default {
    exists,
    updateLang,
    matchPhoneNumber,
    update,
    removeFromSystem,
    insert,
    get,
    gets,
    getIds,
    updateRole,
};