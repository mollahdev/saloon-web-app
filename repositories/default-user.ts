import { prisma } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { passwordSaltRounds } from '@/constants';
import { defaultWorkingHours } from '@/constants';

interface DefaultUserProps {
    email: string;
    password: string;
}

export const generateDefaultUser = async (props: DefaultUserProps) => {
    const { email, password } = props;

    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    const user = await prisma.user.upsert({
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
    for (const day of defaultWorkingHours) {
        await prisma.workingHour.upsert({
            where: {
                userId_dayOfWeek: {
                    userId: user.id,
                    dayOfWeek: day.dayOfWeek,
                },
            },
            update: {
                isOffDay: day.isOffDay,
                startTime: day.startTime,
                endTime: day.endTime,
            },
            create: {
                userId: user.id,
                dayOfWeek: day.dayOfWeek,
                isOffDay: day.isOffDay,
                startTime: day.startTime,
                endTime: day.endTime,
            },
        });
    }
};
