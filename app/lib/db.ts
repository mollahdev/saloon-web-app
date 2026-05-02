import { PrismaClient } from '@/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { dbUrl } from '@/constants/db';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const adapter = new PrismaMariaDb(dbUrl);
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
