import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus, isAdminOrOwner } from '@/app/lib/permissions';
import { couponSchema } from '@/app/lib/validation/coupon';

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

        // Fetch coupons from the database
        const dbCoupons = await prisma.coupon.findMany({
            include: {
                services: true,
                excludeServices: true,
                staffs: true,
                excludeStaffs: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            message: 'Coupons fetched successfully',
            data: dbCoupons,
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

        // Normalize code to uppercase
        if (body && typeof body.code === 'string') {
            body.code = body.code.trim().toUpperCase();
        }

        const val = couponSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            code,
            description,
            discountType,
            amount,
            expiryDate,
            usageLimit,
            minimumSpend,
            maximumSpend,
            services,
            excludeServices,
            staffs,
            excludeStaffs,
            status,
        } = val.data;

        // Check if duplicate code exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code },
        });

        if (existingCoupon) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: { code: ['Coupon code already exists'] },
                },
                { status: 400 }
            );
        }

        const parsedExpiry = expiryDate ? new Date(expiryDate) : null;

        const newCoupon = await prisma.coupon.create({
            data: {
                code,
                description: description || null,
                discountType,
                amount,
                expiryDate: parsedExpiry,
                usageLimit: usageLimit ?? null,
                minimumSpend: minimumSpend ?? null,
                maximumSpend: maximumSpend ?? null,
                status,
                services:
                    services && services.length > 0
                        ? {
                              connect: services.map((id) => ({ id })),
                          }
                        : undefined,
                excludeServices:
                    excludeServices && excludeServices.length > 0
                        ? {
                              connect: excludeServices.map((id) => ({ id })),
                          }
                        : undefined,
                staffs:
                    staffs && staffs.length > 0
                        ? {
                              connect: staffs.map((id) => ({ id })),
                          }
                        : undefined,
                excludeStaffs:
                    excludeStaffs && excludeStaffs.length > 0
                        ? {
                              connect: excludeStaffs.map((id) => ({ id })),
                          }
                        : undefined,
            },
            include: {
                services: true,
                excludeServices: true,
                staffs: true,
                excludeStaffs: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Coupon created successfully',
                data: newCoupon,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
