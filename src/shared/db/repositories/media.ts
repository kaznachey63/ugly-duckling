import type { Media } from '@shared/types/DB';
import prisma from '@shared/db/config';
import shared from './shared';

/**
 * Получение сообщений
 */
async function get(messageId: number): Promise<Media[] | undefined> {
    try {
        return await prisma.media.findMany({
            where: {
                message_id: messageId
            },
            include: {
                message: {
                    include: {
                        sendout: {
                            include: {
                                execution: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Ошибка при получении медиа", error);    
        return undefined;
    }
}

/**
 * Добавление медиа
 */
async function add(media: Media) {
    try {
        await prisma.media.create({
            data: {
                name: media.name,
                position: await shared.getPosition(media.message_id!, 'media'),
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
    get,
    add,
    clear
}