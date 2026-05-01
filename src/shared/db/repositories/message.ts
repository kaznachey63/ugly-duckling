import type { Message } from '@shared/types/DB';
import prisma from '@shared/db/config';
import type { PaginationType } from '@shared/types/PaginationType';

/**
 * Получение сообщения по айди рассылки, сообщения и типу пагинаци
 * @param sendoutId Айди рассылки
 * @param messageId Айди сообщения след/пред/нет
 * @param type Тип пагинации след/пред/нет
 */
async function getByIdForPagination(sendoutId: number, messageId: number, type: PaginationType): Promise<Message | undefined> {
    try {
        let where: any = {
            sendout_id: sendoutId
        };

        let orderBy: any = undefined;

        switch (type) {
            case 'next': {
                where.id = { gt: messageId };
                orderBy = { id: 'asc' };
                break;
            }

            case 'prev': {
                where.id = { lt: messageId };
                orderBy = { id: 'desc' };
                break;
            }

            case 'none': {
                where.id = messageId;
                break;
            }
        }

        return await prisma.message.findFirst({
            where,
            orderBy,
            include: {
                media: true
            }
        }) ?? undefined;

    } catch (error) {
        console.error("Ошибка при получении сообщения", error);
        return undefined;
    }
}

/**
 * Получение собщения по айди
 */
async function getById(messageId: number): Promise<Message | undefined> {
    try {
        return await prisma.message.findFirst({
            where: {
                id: messageId
            },
            include: {
                media: true
            }
        }) ?? undefined;

    } catch (error) {
        console.error("Ошибка при получении сообщения", error);
        return undefined;
    }
}


/**
 * Получение сообщения по айди рассылки и позиции
 */
async function getByPosition(sendoutId: number, position: number): Promise<Message | undefined> {
    try {
        return await prisma.message.findFirst({
            where: {
                sendout_id: sendoutId,
                position: position
            },
            include: {
                media: true
            }
        }) ?? undefined;
    } catch (error) {
        console.error("Ошибка при получении сообщения по позиции", error);
        return undefined;
    }
}

/**
 * Получение сообщения по айди рассылки и позиции
 */
async function getByFirstMessage(sendoutId: number, position: number): Promise<Message | undefined> {
    try {
        return await prisma.message.findFirst({
            where: {
                sendout_id: sendoutId,
                position: position
            },
            include: {
                media: true
            }
        }) ?? undefined;
    } catch (error) {
        console.error("Ошибка при получении сообщения по позиции", error);
        return undefined;
    }
}


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
    getByIdForPagination,   
    getById,
    getByPosition,
    getMessages,
    create,
    update,
    remove,
    clear
};