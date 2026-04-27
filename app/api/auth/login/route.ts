import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { loginSchema } from '@/app/lib/validation/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const body = await request.json();
    const val = loginSchema.safeParse(body);

    if (!val.success) {
        return NextResponse.json(
            {
                message: 'Validation failed',
                errors: val.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email: val.data.email,
        },
    });

    if (!user) {
        return NextResponse.json(
            {
                message: 'User not found',
            },
            { status: 404 }
        );
    }

    const isPasswordMatch = await bcrypt.compare(val.data.password, user.passwordHash);

    if (!isPasswordMatch) {
        return NextResponse.json(
            {
                message: 'Invalid credentials',
            },
            { status: 401 }
        );
    }

    return NextResponse.json({
        message: 'login successful',
        data: {
            accessToken: '',
            body: val.data,
        },
    });
}
