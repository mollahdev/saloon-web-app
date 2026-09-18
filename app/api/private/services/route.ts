import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus, isAdminOrOwner } from '@/app/lib/permissions';
import { serviceSchema } from '@/app/lib/validation/service';

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

        // Fetch services from the database
        const dbServices = await prisma.service.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                serviceCoupons: {
                    include: {
                        coupon: true,
                    },
                },
                pricingVariations: {
                    include: {
                        staff: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                        pricingCoupons: {
                            include: {
                                coupon: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            message: 'Services fetched successfully',
            data: dbServices,
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
        const val = serviceSchema.safeParse(body);

        if (!val.success) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: val.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const newService = await prisma.service.create({
            data: {
                name: val.data.name,
                description: val.data.description || null,
                price: val.data.price,
                duration: val.data.duration,
                image: val.data.image || null,
                status: val.data.status || 'ACTIVE',
                serviceCoupons: {
                    create:
                        val.data.coupons?.map((c) => ({
                            couponId: c.couponId,
                            amount: c.amount,
                        })) || [],
                },
                pricingVariations: {
                    create:
                        val.data.pricingVariations?.map((p) => ({
                            staffId: p.staffId,
                            price: p.price,
                            pricingCoupons: {
                                create:
                                    p.coupons?.map((c) => ({
                                        couponId: c.couponId,
                                        amount: c.amount,
                                    })) || [],
                            },
                        })) || [],
                },
            },
            include: {
                serviceCoupons: {
                    include: {
                        coupon: true,
                    },
                },
                pricingVariations: {
                    include: {
                        staff: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                        pricingCoupons: {
                            include: {
                                coupon: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(
            {
                message: 'Service created successfully',
                data: newService,
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'A duplicate entry exists for staff pricing or coupon assignment' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
