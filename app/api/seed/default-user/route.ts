import { NextResponse } from 'next/server';
import { generateDefaultUser } from '@/repositories/default-user';

export async function GET() {
    const OWNER_EMAIL = process.env.OWNER_EMAIL;
    const OWNER_PASSWORD = process.env.OWNER_PASSWORD;

    if (!OWNER_EMAIL || !OWNER_PASSWORD) {
        return NextResponse.json({ message: 'Default defined' }, { status: 400 });
    }

    await generateDefaultUser({
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
    });

    return NextResponse.json({ message: `✅ Default owner is ready.` });
}
