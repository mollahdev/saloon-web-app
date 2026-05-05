import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { workingHoursSchema } from '@/app/lib/validation/working-hours';
import { defaultWorkingHours, STATUS } from '@/constants';
import { isAdminOrOwner } from '@/app/lib/permissions';

export async function GET(
    request: Request
    // { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        // const { id: staffId } = await params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || user.status !== STATUS.ACTIVE) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        if (!isAdminOrOwner(user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // Verify staff exists
        const staff = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, avatar: true, position: true },
        });

        if (!staff) {
            return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
        }

        const workingHours = await prisma.workingHour.findMany({
            where: { userId: userId },
        });

        if (workingHours.length === 0) {
            return NextResponse.json({
                message: 'Working hours fetched successfully',
                data: { staff, workingHours: defaultWorkingHours },
            });
        }

        // Sort by day order
        const dayOrder = defaultWorkingHours.map((d) => d.dayOfWeek);
        const sortedWorkingHours = workingHours.sort(
            (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
        );

        return NextResponse.json({
            message: 'Working hours fetched successfully',
            data: {
                staff,
                workingHours: sortedWorkingHours,
            },
        });
    } catch (error: any) {
        console.error('Fetch staff schedule error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const { id: staffId } = await params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || user.status !== STATUS.ACTIVE) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        if (!isAdminOrOwner(user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // Verify staff exists
        const staff = await prisma.user.findUnique({
            where: { id: staffId },
            select: { id: true },
        });

        if (!staff) {
            return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
        }

        const body = await request.json();
        const val = workingHoursSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const upsertPromises = val.data.workingHours.map((wh) => {
            const startTime = wh.startTime.length === 5 ? `${wh.startTime}:00` : wh.startTime;
            const endTime = wh.endTime.length === 5 ? `${wh.endTime}:00` : wh.endTime;

            return prisma.workingHour.upsert({
                where: {
                    userId_dayOfWeek: {
                        userId: staffId,
                        dayOfWeek: wh.dayOfWeek,
                    },
                },
                update: {
                    isOffDay: wh.isOffDay,
                    startTime,
                    endTime,
                },
                create: {
                    userId: staffId,
                    dayOfWeek: wh.dayOfWeek,
                    isOffDay: wh.isOffDay,
                    startTime,
                    endTime,
                },
            });
        });

        const result = await prisma.$transaction(upsertPromises);

        return NextResponse.json({
            message: 'Schedule updated successfully',
            data: { workingHours: result },
        });
    } catch (error: any) {
        console.error('Update staff schedule error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
