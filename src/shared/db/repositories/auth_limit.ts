import prisma from '@shared/db/config';
import type { AuthLimit } from '@shared/types/DB';

/**
 * Обновление полей лимита по авторизации
 */
async function update(authLimit: AuthLimit) {
    try {
        await prisma.auth_limit.update({
            where: {
                telegram_id: authLimit.telegram_id!
            },
            data: {
                blocked_until: authLimit.blocked_until,
                failed_attempts: authLimit.failed_attempts,
                last_attempt_at: authLimit.last_attempt_at
            }
        });
    } catch (error) {
        console.error("Ошибка при обновлении ограничения лимитов авторизации", error);
    }
}

/**
 * Получение информации о пользователе в списках авторизации по телеграм айди
 */
async function get(telegramId: bigint): Promise<AuthLimit | null> {
    try {
        return await prisma.auth_limit.findFirst({
            where: {
                telegram_id: telegramId
            }
        });
    } catch {
        return null;
    }
}

/**
 * Добавление пользователя в базу авторизации
 */
async function insert(authLimit: AuthLimit) {
    try {
        await prisma.auth_limit.create({
            data: {
                blocked_until: authLimit.blocked_until,
                failed_attempts: authLimit.failed_attempts,
                last_attempt_at: authLimit.last_attempt_at
            }
        });
    } catch (error) {
        console.error("Ошибка при вставке пользователя в огр. авторизации", error);
    }
}

export default {
    insert,
    get,
    update,
}