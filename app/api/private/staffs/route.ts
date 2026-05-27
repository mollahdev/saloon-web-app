import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus, isAdminOrOwner } from '@/app/lib/permissions';
import { ROLE } from '@/constants';
import { createStaffSchema } from '@/app/lib/validation/staff';
import { createStaff } from '@/repositories/staff';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !isActiveStatus(user) || !isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // Fetch staff members from the database
        const dbStaffs = await prisma.user.findMany({
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
            data: dbStaffs,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !isActiveStatus(user) || !isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const val = createStaffSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        try {
            const newStaff = await createStaff({
                name: val.data.name,
                email: val.data.email,
                role: val.data.role,
                position: val.data.position,
                bio: val.data.bio || null,
            });

            return NextResponse.json(
                {
                    message: 'Staff created successfully',
                    data: newStaff,
                },
                { status: 201 }
            );
        } catch (error: any) {
            return NextResponse.json(
                { message: error.message || 'Staff already exists' },
                { status: 400 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
