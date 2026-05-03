import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { profileSchema } from '@/app/lib/validation/profile';
import { STATUS } from '@/constants';

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
            omit: {
                passwordHash: true,
            },
        });

        if (!user || user.status !== STATUS.ACTIVE) {
            return NextResponse.json({ message: 'User not found or inactive' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'User fetched successfully',
            data: user,
        });
    } catch (error: any) {
        console.error('Fetch profile error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const val = profileSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: val.data.name,
                position: val.data.position,
                phone: val.data.phone || null,
                address: val.data.address || null,
                bio: val.data.bio || null,
                role: val.data.role,
                status: val.data.status,
            },
            omit: {
                passwordHash: true,
            },
        });

        return NextResponse.json({
            message: 'Profile updated successfully',
            data: updatedUser,
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
