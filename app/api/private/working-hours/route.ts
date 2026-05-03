import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { workingHoursSchema } from '@/app/lib/validation/working-hours';
import { defaultWorkingHours } from '@/constants';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id') as string;

        const workingHours = await prisma.workingHour.findMany({
            where: { userId },
        });

        if (workingHours.length === 0) {
            return NextResponse.json({
                message: 'Working hours fetched successfully',
                data: { workingHours: defaultWorkingHours },
            });
        }

        // Sort by day order in constants to ensure consistent UI
        const dayOrder = defaultWorkingHours.map((d) => d.dayOfWeek);
        const sortedWorkingHours = workingHours.sort(
            (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
        );

        return NextResponse.json({
            message: 'Working hours fetched successfully',
            data: {
                workingHours: sortedWorkingHours,
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

        // Use transaction to update all working hours
        const upsertPromises = val.data.workingHours.map((wh) => {
            // Ensure time format is HH:mm:00 if only HH:mm is provided
            const startTime = wh.startTime.length === 5 ? `${wh.startTime}:00` : wh.startTime;
            const endTime = wh.endTime.length === 5 ? `${wh.endTime}:00` : wh.endTime;

            return prisma.workingHour.upsert({
                where: {
                    userId_dayOfWeek: {
                        userId,
                        dayOfWeek: wh.dayOfWeek,
                    },
                },
                update: {
                    isOffDay: wh.isOffDay,
                    startTime,
                    endTime,
                },
                create: {
                    userId,
                    dayOfWeek: wh.dayOfWeek,
                    isOffDay: wh.isOffDay,
                    startTime,
                    endTime,
                },
            });
        });

        const result = await prisma.$transaction(upsertPromises);

        return NextResponse.json({
            message: 'Working hours updated successfully',
            data: { workingHours: result },
        });
    } catch (error: any) {
        console.error('Update working hours error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
