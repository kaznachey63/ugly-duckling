import type { Prisma } from '@shared/db/prisma/client';

export type Contract = Partial<Prisma.contractGetPayload<{
    include: { 
        user: {
            include: {
                role: true
            }
        }
    }
}>>;

export type Sendout = Partial<Prisma.sendoutGetPayload<{
    include: {
        contract: {
            include: {
                user: {
                    include: {
                        role: true
                    }
                }
            }
        },
        credential: true,
        user: {
            include: {
                role: true
            }
        }
    }
}>>;

export type User = Partial<Prisma.userGetPayload<{
    include: { role: true }
}>>;

export type UserIds = Pick<User, 'id'>;

export type Bot = Prisma.botGetPayload<{}>;
export type Credential = Prisma.credentialGetPayload<{}>;
export type Role = Prisma.roleGetPayload<{}>;
export type Chat = Partial<Prisma.chatGetPayload<{}>>;