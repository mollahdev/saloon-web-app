import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { STATUS } from '@/constants';
import { isAdminOrOwner } from '@/app/lib/permissions';
import { timeOffSchema } from '@/app/lib/validation/time-off';

/**
 * PUT /api/private/schedule/staffs/:id/time-off/:timeOffId
 * Update a specific time-off entry
 */
export async function PUT(
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
        const existing = await prisma.staffTimeOff.findFirst({
            where: { id: timeOffId, userId: staffId },
        });

        if (!existing) {
            return NextResponse.json({ message: 'Time off entry not found' }, { status: 404 });
        }

        const body = await request.json();
        const val = timeOffSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = val.data;

        const updateData: Record<string, any> = {
            type: data.type,
            title: data.title,
            isFullDay: data.isFullDay,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            startTime: data.startTime || null,
            endTime: data.endTime || null,
            repeatType: data.repeatType || null,
            repeatDay: data.repeatDay ?? null,
            repeatMonth: data.repeatMonth ?? null,
        };

        const updated = await prisma.staffTimeOff.update({
            where: { id: timeOffId },
            data: updateData as any,
        });

        return NextResponse.json({
            message: 'Time off updated successfully',
            data: updated,
        });
    } catch (error: any) {
        console.error('Update time-off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/private/schedule/staffs/:id/time-off/:timeOffId
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
