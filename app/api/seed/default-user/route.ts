import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { passwordSaltRounds } from '@/constants';

export async function GET() {
    const OWNER_EMAIL = process.env.OWNER_EMAIL;
    const OWNER_PASSWORD = process.env.OWNER_PASSWORD;

    if (!OWNER_EMAIL || !OWNER_PASSWORD) {
        return NextResponse.json({ message: 'Default defined' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(OWNER_PASSWORD, passwordSaltRounds);
    await prisma.user.upsert({
        where: { email: OWNER_EMAIL },
        update: {
            passwordHash: hashedPassword,
        },

        create: {
            name: 'Admin',
            email: OWNER_EMAIL,
            passwordHash: hashedPassword,
            status: 'LOCKED',
            role: 'OWNER',
        },
    });

    return NextResponse.json({ message: `✅ Default owner is ready.` });
}
