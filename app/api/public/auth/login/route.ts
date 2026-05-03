import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { loginSchema } from '@/app/lib/validation/auth';
import bcrypt from 'bcryptjs';
import { generatePermanentToken } from '@/app/lib/auth';

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

    const accessToken = await generatePermanentToken({
        userId: user.id,
        role: user.role,
    });

    const response = NextResponse.json({
        message: 'login successful',
        data: {
            accessToken: accessToken,
        },
    });

    response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years (effectively no limit)
    });

    return response;
}
