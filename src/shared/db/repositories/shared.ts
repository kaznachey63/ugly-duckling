import prisma from '@shared/db/config';

type TargetTable = "message" | "schedule" | "media";

const positionQueries = {
    message: (id: number) => prisma.message.findFirst({
        where: { sendout_id: id },
        orderBy: { position: 'desc' },
        select: { position: true }
    }),
    schedule: (id: number) => prisma.schedule.findFirst({
        where: { sendout_id: id },
        orderBy: { position: 'desc' },
        select: { position: true }
    }),
    media: (id: number) => prisma.media.findFirst({
        where: { message_id: id },
        orderBy: { position: 'desc' },
        select: { position: true }
    })
} as const;

async function getPosition(targetId: number, table: TargetTable): Promise<number> {
    const result = await positionQueries[table](targetId);
    
    return result ? result.position! + 1 : 0;
}

export default {
    getPosition
}