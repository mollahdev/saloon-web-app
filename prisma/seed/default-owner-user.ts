import { PrismaClient } from '../../generated/prisma/client';
import bcrypt from 'bcryptjs';
import { dbUrl, passwordSaltRounds } from '../../constants';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(dbUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Get credentials from environment variables (or defaults)
    const OWNER_EMAIL = process.env.OWNER_EMAIL;
    const OWNER_PASSWORD = process.env.OWNER_PASSWORD;

    if (!OWNER_EMAIL || !OWNER_PASSWORD) {
        throw new Error('OWNER_EMAIL or OWNER_PASSWORD is not defined');
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(OWNER_PASSWORD, passwordSaltRounds);

    // 3. Upsert the Owner
    // 'upsert' ensures we don't get 'Unique Constraint' errors if the user exists
    const owner = await prisma.user.upsert({
        where: { email: OWNER_EMAIL },
        update: {
            passwordHash: hashedPassword, // Updates password if owner already exists
        },
        create: {
            name: 'Admin',
            email: OWNER_EMAIL,
            passwordHash: hashedPassword,
            status: 'LOCKED',
            role: 'OWNER',
        },
    });

    console.log(`✅ Default owner ${owner.email} is ready.`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
