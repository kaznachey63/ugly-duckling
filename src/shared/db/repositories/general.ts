import prisma from '@shared/db/config';

/**
 * Получение айди последнего сообщения в списке идей
 */
async function getIdeaLastMessageId(): Promise<string> {
    const general = await prisma.general.findFirst({
        where: {
            id: 1
        },
        select: {
            last_idea_id: true
        }
    });
    return String(general?.last_idea_id);
}

/**
 * Обновление айди последнего сообщения в списке идей
 */
async function updateIdeaLastMessageId(messageId: number) {
    await prisma.general.updateMany({
        where: {
            id: 1
        },
        data: {
            last_idea_id: messageId
        }
    });
}

/**
 * Получение режима разработки (для бота)
 */
async function getModeMaintenace(): Promise<boolean> {
    const result = await prisma.general.findFirst({
        select: { mode_maintenace: true }
    });
    return result?.mode_maintenace!;
}

/**
 * Смена режима разработки
 */
async function setModeMaintenace(mode: boolean) {
    const row = await prisma.general.findFirst({
        select: { id: true }
    });
    if (!row) return;

    await prisma.general.update({
        where: { 
            id: row.id 
        },
        data: {
            mode_maintenace: mode
        }
    });
}

export default {
    getIdeaLastMessageId,
    updateIdeaLastMessageId,
    getModeMaintenace,
    setModeMaintenace,
}