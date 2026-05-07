import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isAdminOrOwner } from '@/app/lib/permissions';
import { STATUS } from '@/constants';

export async function DELETE(
    request: Request
    // { params }: { params: { id: string } }
) {
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

        if (!isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // const { id } = params;

        // In a real app, we would delete from the database
        // await prisma.user.delete({ where: { id } });

        return NextResponse.json({
            message: 'Staff deleted successfully',
            data: null,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
