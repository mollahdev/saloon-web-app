import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                position: true,
                bio: true,
                avatar: true,
                status: true,
            },
        });
        return NextResponse.json({ data: users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
