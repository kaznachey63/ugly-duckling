import type { Message } from '@shared/types/DB';
import prisma from '@shared/db/config';

/**
 * Получение сообщений 
 */
async function getMessages(sendoutId: number): Promise<Message[]> {
    try {
        return await prisma.message.findMany({
            where: {
                sendout_id: sendoutId
            },
            include: {
                media: true
            },
            orderBy: { position: 'asc' }
        });
    } catch (error) {
        console.error("Ошибка при получении сообщений", error);
        return [];
    }
}

/**
 * Очистка сообщений
 */
async function clear(sendoutId: number) {
    try {
        await prisma.message.deleteMany({
            where: {
                sendout_id: sendoutId
            }
        });
    } catch (error) {
        console.error("Ошибка при очистке сообщений", error);
    }
}

/**
 * Удаление сообщения по айди
 */
async function remove(messageId: number) {
    try {
        await prisma.message.delete({
            where: { 
                id: messageId 
            }
        });
    } catch (error) {
        console.error("Ошибка при удалении сообщения", error);
    }
}

/**
 * Обновление сообщения по айди
 */
async function update(message: Message){
    try {
        await prisma.message.update({
            where: { 
                id: message.id 
            },
            data: {
                caption: message.caption,
                entities: message.entities !== undefined ? message.entities! : undefined
            }
        });
    } catch (error) {
        console.error("Ошибка при обновлении сообщения", error);
    }
}

/**
 * Добавление сообщения
 */
async function create(message: Message) {
    try {
        await prisma.message.create({
            data: {
                caption: message.caption,
                position: await prisma.message.count(),
                entities: message.entities as any,
                sendout_id: message.sendout_id
            }
        });
    } catch (error) {
        console.error("Ошибка при добавлении сообщения", error);
        throw error;
    }
}

export default {
    getMessages,
    create,
    update,
    remove,
    clear
};