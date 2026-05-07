import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus, isAdminOrOwner } from '@/app/lib/permissions';
import { ROLE, STATUS } from '@/constants';

const dummyStaffs = [
    {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        position: 'Senior Barber',
        role: ROLE.ADMIN,
        status: STATUS.ACTIVE,
        avatar: 'https://i.pravatar.cc/150?u=alex',
        phone: '123-456-7890',
        address: '123 Broadway, NY',
        bio: 'Master of classic cuts and beard trims.',
    },
    {
        id: '2',
        name: 'Sarah Miller',
        email: 'sarah@example.com',
        position: 'Master Stylist',
        role: ROLE.MEMBER,
        status: STATUS.ACTIVE,
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        phone: '234-567-8901',
        address: '456 5th Ave, NY',
        bio: 'Expert in modern styling and hair coloring.',
    },
    {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@example.com',
        position: 'Technician',
        role: ROLE.MEMBER,
        status: STATUS.ACTIVE,
        avatar: 'https://i.pravatar.cc/150?u=michael',
        phone: '345-678-9012',
        address: '789 Madison Ave, NY',
        bio: 'Specializes in precision fading and hair treatments.',
    },
    {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        position: 'Color Specialist',
        role: ROLE.MEMBER,
        status: STATUS.INACTIVE,
        avatar: 'https://i.pravatar.cc/150?u=emma',
        phone: '456-789-0123',
        address: '101 Park Ave, NY',
        bio: 'Passionate about creative hair colors and designs.',
    },
    {
        id: '5',
        name: 'David Brown',
        email: 'david@example.com',
        position: 'Junior Barber',
        role: ROLE.MEMBER,
        status: STATUS.PENDING_VERIFICATION,
        avatar: 'https://i.pravatar.cc/150?u=david',
        phone: '567-890-1234',
        address: '202 Lexington Ave, NY',
        bio: 'Learning from the best to become a master barber.',
    },
];

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

        // Keep the database query to ensure the table/connection is valid
        await prisma.user.findMany({
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
            data: dummyStaffs,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
