import prisma from '@shared/db/config';

/**
 * Получение айди последнего сообщения в списке идей
 */
async function getIdeaLastMessageId(): Promise<string> {
    const bot = await prisma.bot.findFirst({
        where: {
            id: 1
        },
        select: {
            last_idea_id: true
        }
    });
    return String(bot?.last_idea_id);
}

/**
 * Обновление айди последнего сообщения в списке идей
 */
async function updateIdeaLastMessageId(messageId: number) {
    await prisma.bot.updateMany({
        where: {
            id: 1
        },
        data: {
            last_idea_id: messageId
        }
    });
}

export default {
    getIdeaLastMessageId,
    updateIdeaLastMessageId
}