import type { Schedule } from '@shared/types/DB';
import prisma from '@shared/db/config';
import shared from './shared';

/**
 * Получение графика
 */
async function get(sendoutId: number): Promise<Schedule[] | undefined> {
    try {
        return await prisma.schedule.findMany({
            include: {
                sendout: {
                    include: {
                        status: true,
                        execution: true
                    }
                }
            },
            where: {
                sendout: {
                    id: sendoutId
                }
            },
            orderBy: {
                position: 'asc'
            }
        });
    } catch (error) {
        console.error("Ошибка при получении графика", error);
    }
}

/**
 * Получение инфо о времени по id времени
 */
async function getTime(timeId: number): Promise<Schedule | undefined> {
    try {
        return await prisma.schedule.findFirst({
            where: { 
                id: timeId
            },
            select: { 
                id: true, 
                cron: true, 
                label: true 
            }
        }) ?? undefined;
    } catch (error) {
        console.log("Ошибка при получении времени", error);
        return undefined;
    }
}

/**
 * Добавление нового времени для рассылки
 */
async function create(schedule: Schedule) {
    try {
        await prisma.schedule.create({
            data: {
                cron: schedule.cron,
                label: schedule.label,
                position: await shared.getPosition(schedule.sendout_id!, 'schedule'),
                sendout_id: schedule.sendout_id
            }
        });
    } catch (error) {
        console.log("Ошибка при добавлении времени", error);
    }
}

/**
 * Обновление времени в графике
 */
async function update(schedule: Schedule) {
    try {
        await prisma.schedule.update({
            where: { 
                id: schedule.id 
            },
            data: {
                cron: schedule.cron,
                label: schedule.label,
                sendout_id: schedule.sendout_id
            }
        });
    } catch (error) {
        console.log("Ошибка при изменении времени", error);
    }
}

/**
 * Удаление времени по айди
 */
async function remove(timeId: number) {
    try {
        await prisma.schedule.delete({
            where: { 
                id: timeId
            }
        });
    } catch (error) {
        console.log("Ошибка при удалении времени", error);
    }
}

/**
 * Очистка графика по айди рассылки
 */
async function clear(sendoutId: number) {
    try {
        await prisma.schedule.deleteMany({
            where: { 
                sendout_id: sendoutId
            }
        });
    } catch (error) {
        console.error("Ошибка при очистке графика", error);
    }
}

export default {
    get,
    getTime,
    remove,
    create,
    update,
    clear
};