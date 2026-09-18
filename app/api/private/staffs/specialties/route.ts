import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus } from '@/app/lib/permissions';

const DEFAULT_SPECIALTIES = [
    'Straight Hair',
    'Fade Master',
    'Asian Hair',
    'Long Hair',
    'Caesars Cut',
    'Curly / Wavy Hair',
];

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // Auto-seed default specialties if table is empty
        const count = await prisma.specialty.count();
        if (count === 0) {
            await prisma.specialty.createMany({
                data: DEFAULT_SPECIALTIES.map((name) => ({ name })),
                skipDuplicates: true,
            });
        }

        const specialties = await prisma.specialty.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({
            message: 'Specialties fetched successfully',
            data: specialties,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
