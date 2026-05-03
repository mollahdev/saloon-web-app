import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isAdminOrOwner } from '@/app/lib/permissions';
import { ROLE, STATUS } from '@/constants';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || user.status !== STATUS.ACTIVE) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        if (!isAdminOrOwner(user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: ROLE.OWNER,
                },
            },
            omit: {
                passwordHash: true,
            },
        });

        return NextResponse.json({
            message: 'Staffs fetched successfully',
            data: users,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
