import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { defaultSchedule } from '@/constants';
import { isAdminOrOwner, isActiveStatus } from '@/app/lib/permissions';
import { size } from 'lodash';
import { ScheduleSchema } from '@/app/lib/validation/schedule';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || !isAdminOrOwner(user) || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const workingHours = await prisma.businessWeeklyHour.findMany();

        if (size(workingHours) === 0) {
            return NextResponse.json({
                message: 'fetched default schedule',
                data: {
                    schedule: defaultSchedule,
                },
            });
        }

        // Sort by day order in constants to ensure consistent UI
        const dayOrder = defaultSchedule.map((d) => d.dayOfWeek);
        const sortedWorkingHours = workingHours.sort(
            (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
        );

        return NextResponse.json({
            message: 'fetched custom schedule',
            data: {
                schedule: sortedWorkingHours,
            },
        });
    } catch (error: any) {
        console.error('Fetch working hours error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || !isAdminOrOwner(user) || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const val = ScheduleSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        // Use transaction to update all working hours
        const upsertPromises = val.data.schedule.map((wh) => {
            // Ensure time format is HH:mm:00 if only HH:mm is provided
            const startTime =
                wh.startTime && wh.startTime.length === 5 ? `${wh.startTime}:00` : wh.startTime;
            const endTime = wh.endTime && wh.endTime.length === 5 ? `${wh.endTime}:00` : wh.endTime;

            return prisma.businessWeeklyHour.upsert({
                where: {
                    dayOfWeek: wh.dayOfWeek,
                },
                update: {
                    isOffDay: wh.isOffDay,
                    ...(startTime ? { startTime } : {}),
                    ...(endTime ? { endTime } : {}),
                },
                create: {
                    dayOfWeek: wh.dayOfWeek,
                    isOffDay: wh.isOffDay,
                    startTime: startTime || '10:00:00',
                    endTime: endTime || '19:00:00',
                },
            });
        });

        const result = await prisma.$transaction(upsertPromises);

        return NextResponse.json({
            message: 'Schedule updated successfully',
            data: { schedule: result },
        });
    } catch (error: any) {
        console.error('Schedule error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
