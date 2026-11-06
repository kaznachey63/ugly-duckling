import { PrismaClient } from './prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export default new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});