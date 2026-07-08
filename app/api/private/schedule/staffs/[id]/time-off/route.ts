import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { STATUS } from '@/constants';
import { isAdminOrOwner, isActiveStatus } from '@/app/lib/permissions';
import { timeOffSchema } from '@/app/lib/validation/time-off';

/**
 * GET /api/private/schedule/staffs/:id/time-off
 * List all time-off entries for a staff member
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const { id: staffId } = await params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        if (!isAdminOrOwner(user) && userId !== staffId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const timeOffs = await prisma.staffTimeOff.findMany({
            where: { userId: staffId },
            orderBy: { startDate: 'asc' },
        });

        return NextResponse.json({
            message: 'Time off entries fetched successfully',
            data: timeOffs,
        });
    } catch (error: any) {
        console.error('Fetch time-off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/private/schedule/staffs/:id/time-off
 * Create a new time-off entry for a staff member
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        if (!isAdminOrOwner(user)) {
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

        const createData: Record<string, any> = {
            userId: staffId,
            type: data.type,
            title: data.title,
            isFullDay: data.isFullDay,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            startTime: data.startTime || null,
            endTime: data.endTime || null,
            repeatType: data.repeatType || null,
            repeatDay: data.repeatDay ?? null,
        };

        if (data.repeatMonth != null) {
            createData.repeatMonth = data.repeatMonth;
        }

        const timeOff = await prisma.staffTimeOff.create({
            data: createData as any,
        });

        return NextResponse.json(
            {
                message: 'Time off created successfully',
                data: timeOff,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create time-off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
