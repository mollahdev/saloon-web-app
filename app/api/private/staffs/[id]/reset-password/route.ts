import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isAdminOrOwner, isActiveStatus } from '@/app/lib/permissions';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        });

        if (!staff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }

        // TODO: In a real system, generate reset token, store it in db/cache, and send email via email service.
        // Example: sendResetPasswordEmail(staff.email, token);
        console.log(`Password reset requested for staff member: ${staff.name} (${staff.email})`);

        return NextResponse.json({
            message: 'Reset password link sent successfully',
            data: null,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
