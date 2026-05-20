import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isAdminOrOwner, isActiveStatus } from '@/app/lib/permissions';
import { timeOffSchema } from '@/app/lib/validation/time-off';

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

        const timeOff = await prisma.businessTimeOff.findMany();

        return NextResponse.json({
            message: 'fetched business time off',
            data: timeOff,
        });
    } catch (error: any) {
        console.error('Fetch business time off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

        const data = {
            type: val.data.type as any,
            title: val.data.title || 'Time Off',
            isFullDay: val.data.isFullDay ?? true,
            startDate: new Date(val.data.startDate),
            endDate: val.data.endDate ? new Date(val.data.endDate) : null,
            startTime: val.data.startTime || null,
            endTime: val.data.endTime || null,
            repeatType: (val.data.repeatType as any) || null,
            repeatDay: val.data.repeatDay ?? null,
            repeatMonth: val.data.repeatMonth ?? null,
        };

        const timeOff = await prisma.businessTimeOff.create({ data });

        return NextResponse.json({
            message: 'Time off added successfully',
            data: timeOff,
        });
    } catch (error: any) {
        console.error('Create time off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
