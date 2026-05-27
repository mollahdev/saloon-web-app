import { prisma } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { passwordSaltRounds } from '@/constants';
import { STATUS } from '@/constants';
import type { ROLE_TYPE } from '@/constants';
import { randomUUID } from 'crypto';

interface CreateStaffProps {
    name: string;
    email: string;
    role: ROLE_TYPE;
    position: string;
    bio: string | null;
}

export const createStaff = async (props: CreateStaffProps) => {
    const { name, email, role, position, bio } = props;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('Email already exists');
    }

    // Generate a secure temporary password as passwordHash is required by the DB schema
    const tempPassword = randomUUID();
    const hashedPassword = await bcrypt.hash(tempPassword, passwordSaltRounds);

    const newStaff = await prisma.user.create({
        data: {
            name,
            email,
            role,
            position,
            bio,
            passwordHash: hashedPassword,
            status: STATUS.PENDING_VERIFICATION, // Default status for invitation
            // phone, address, and avatar will be null by default
        },
        omit: {
            passwordHash: true,
        },
    });

    // TODO: Connect email service to send an invitation link to the staff member
    // Example: sendInvitationEmail({ email, name, invitationToken: ... });
    // TODO: Connect avatar service if required in the future

    return newStaff;
};
