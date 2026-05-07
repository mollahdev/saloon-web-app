import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { STATUS } from '@/constants';
import { isAdminOrOwner } from '@/app/lib/permissions';

/**
 * DELETE /api/private/staffs/:id/time-off/:timeOffId
 * Delete a specific time-off entry
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; timeOffId: string }> }
) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const { id: staffId, timeOffId } = await params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || user.status !== STATUS.ACTIVE) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        if (!isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // Verify the time-off belongs to this staff
        const timeOff = await prisma.staffTimeOff.findFirst({
            where: { id: timeOffId, userId: staffId },
        });

        if (!timeOff) {
            return NextResponse.json({ message: 'Time off entry not found' }, { status: 404 });
        }

        await prisma.staffTimeOff.delete({
            where: { id: timeOffId },
        });

        return NextResponse.json({
            message: 'Time off deleted successfully',
            data: null,
        });
    } catch (error: any) {
        console.error('Delete time-off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
