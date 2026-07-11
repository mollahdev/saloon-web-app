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
        let dbServices = await prisma.service.findMany({
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

        // Auto-seed with dummy services if empty
        if (dbServices.length === 0) {
            const dummyServices = [
                {
                    name: 'Classic Haircut',
                    description:
                        'A standard professional haircut tailored to your preferences, including a quick wash and styling.',
                    price: 30.0,
                    duration: 30,
                    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&auto=format&fit=crop&q=60',
                },
                {
                    name: 'Beard Trim & Shaping',
                    description:
                        'Keep your beard looking clean and sharp. Includes precision trimming, shaping, and beard oil application.',
                    price: 20.0,
                    duration: 20,
                    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=60',
                },
                {
                    name: 'Hot Towel Shave',
                    description:
                        'Traditional straight razor shave with hot towels, pre-shave cream, warm lather, and soothing aftershave lotion.',
                    price: 35.0,
                    duration: 45,
                    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=60',
                },
                {
                    name: 'Hair Color & Styling',
                    description:
                        'Professional hair coloring service followed by a wash, conditioning treatment, and custom blowout styling.',
                    price: 75.0,
                    duration: 90,
                    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=60',
                },
                {
                    name: 'Scalp Treatment & Massage',
                    description:
                        'Deep cleansing and exfoliating treatment for the scalp, paired with a relaxing 15-minute head massage.',
                    price: 25.0,
                    duration: 30,
                    image: 'https://images.unsplash.com/photo-1517832606589-7a598b647192?w=500&auto=format&fit=crop&q=60',
                },
            ];

            await prisma.service.createMany({
                data: dummyServices,
            });

            dbServices = await prisma.service.findMany({
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
        }

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
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
