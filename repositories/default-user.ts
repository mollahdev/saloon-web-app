import { prisma } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { passwordSaltRounds } from '@/constants';
import { defaultSchedule } from '@/constants';

interface DefaultUserProps {
    email: string;
    password: string;
}

export const generateDefaultUser = async (props: DefaultUserProps) => {
    const { email, password } = props;

    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash: hashedPassword,
        },
        create: {
            name: 'Admin',
            email: email,
            passwordHash: hashedPassword,
            status: 'LOCKED',
            role: 'OWNER',
        },
    });

    // insert default working hours
    for (const day of defaultSchedule) {
        await prisma.businessWeeklyHour.upsert({
            where: {
                dayOfWeek: day.dayOfWeek,
            },
            update: {
                isOffDay: day.isOffDay,
                startTime: day.startTime,
                endTime: day.endTime,
            },
            create: {
                dayOfWeek: day.dayOfWeek,
                isOffDay: day.isOffDay,
                startTime: day.startTime,
                endTime: day.endTime,
            },
        });
    }
};
