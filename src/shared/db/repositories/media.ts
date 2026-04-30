import type { Media } from '@shared/types/DB';
import prisma from '@shared/db/config';

/**
 * Добавление медиа
 */
async function add(media: Media) {
    try {
        await prisma.media.create({
            data: {
                name: media.name,
                position: await prisma.media.count(),
                message_id: media.message_id
            }
        });
    } catch (error) {
        console.error("Ошибка при добавлении медиа", error);
    }
}

/**
 * Очистка медиа
 */
async function clear(messageId: number) {
    try {
        await prisma.media.deleteMany({
            where: {
                message_id: messageId
            }
        });
    } catch (error) {
        console.error("Ошибка при очистке медиа", error);
    }
}
export default {
    add,
    clear
}