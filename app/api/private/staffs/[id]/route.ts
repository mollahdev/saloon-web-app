import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isAdminOrOwner, isActiveStatus } from '@/app/lib/permissions';
import { passwordSaltRounds } from '@/constants';
import { updateStaffSchema } from '@/app/lib/validation/staff';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !isActiveStatus(user) || !isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;

        const staff = await prisma.user.findUnique({
            where: { id },
            omit: {
                passwordHash: true,
            },
        });

        if (!staff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Staff member fetched successfully',
            data: staff,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !isActiveStatus(user) || !isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const val = updateStaffSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        // Check if email already in use by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email: val.data.email,
                NOT: {
                    id,
                },
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email is already in use by another user' },
                { status: 400 }
            );
        }

        const updateData: any = {
            name: val.data.name,
            email: val.data.email,
            position: val.data.position,
            bio: val.data.bio || null,
            phone: val.data.phone || null,
            address: val.data.address || null,
            avatar: val.data.avatar || null,
            role: val.data.role,
            status: val.data.status,
        };

        if (val.data.password && val.data.password.trim() !== '') {
            updateData.passwordHash = await bcrypt.hash(val.data.password, passwordSaltRounds);
        }

        const updatedStaff = await prisma.user.update({
            where: { id },
            data: updateData,
            omit: {
                passwordHash: true,
            },
        });

        return NextResponse.json({
            message: 'Staff updated successfully',
            data: updatedStaff,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id') as string;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !isActiveStatus(user) || !isAdminOrOwner(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;

        // Delete from the database
        await prisma.user.delete({ where: { id } });

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
