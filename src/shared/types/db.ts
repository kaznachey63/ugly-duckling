import type { Prisma } from '@shared/db/prisma/client';

const includeSendout = {
    credential: true,
    user: {
        include: {
            role: true
        }
    },
    contract: {
        include: {
            user: {
                include: {
                    role: true
                }
            }
        }
    },
    status: true,
    execution: true
};

export type Contract = Partial<Prisma.contractGetPayload<{
    include: { user: { include: { role: true } } }
}>>;

export type Sendout = Partial<Prisma.sendoutGetPayload<{
    include: typeof includeSendout
}>>;

export type User = Partial<Prisma.userGetPayload<{
    include: { role: true }
}>>;

export type UserIds = Pick<User, 'id'>;

export type Message = Partial<Prisma.messageGetPayload<{
    include: { sendout: { include: { execution: true, status: true } }, media: true }
}>>;

export type Media = Partial<Prisma.mediaGetPayload<{
    include: { message: { include: { sendout: { include: { execution: true, status: true } } } } }
}>>;

export type Schedule = Partial<Prisma.scheduleGetPayload<{
    include: { sendout: { include: { execution: true, status: true } } }
}>>;

export type Result = Partial<Prisma.resultGetPayload<{}>>;

export type General = Prisma.generalGetPayload<{}>;
export type Credential = Prisma.credentialGetPayload<{}>;
export type Role = Prisma.roleGetPayload<{}>;
export type Chat = Partial<Prisma.chatGetPayload<{}>>;
export type Status = Partial<Prisma.statusGetPayload<{}>>;
export type Execution = Partial<Prisma.executionGetPayload<{}>>;