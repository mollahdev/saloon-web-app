import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isAdminOrOwner, isActiveStatus } from '@/app/lib/permissions';
import { timeOffSchema } from '@/app/lib/validation/time-off';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || !isAdminOrOwner(user) || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id: timeOffId } = await params;
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

        const existing = await prisma.businessTimeOff.findUnique({ where: { id: timeOffId } });
        if (!existing) {
            return NextResponse.json({ message: 'Time off not found' }, { status: 404 });
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
        };

        const updated = await prisma.businessTimeOff.update({
            where: { id: timeOffId },
            data,
        });

        return NextResponse.json({
            message: 'Time off updated successfully',
            data: updated,
        });
    } catch (error: any) {
        console.error('Update time off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { status: true, role: true },
        });

        if (!user || !isAdminOrOwner(user) || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id: timeOffId } = await params;

        const existing = await prisma.businessTimeOff.findUnique({ where: { id: timeOffId } });
        if (!existing) {
            return NextResponse.json({ message: 'Time off not found' }, { status: 404 });
        }

        await prisma.businessTimeOff.delete({
            where: { id: timeOffId },
        });

        return NextResponse.json({
            message: 'Time off removed successfully',
        });
    } catch (error: any) {
        console.error('Delete time off error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
