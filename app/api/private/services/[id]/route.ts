import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus, isAdminOrOwner } from '@/app/lib/permissions';
import { serviceSchema } from '@/app/lib/validation/service';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        const service = await prisma.service.findUnique({
            where: { id },
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

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Service fetched successfully',
            data: service,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        // Verify service exists
        const existingService = await prisma.service.findUnique({
            where: { id },
        });

        if (!existingService) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        const updatedService = await prisma.$transaction(async (tx) => {
            // Delete existing pricing variations
            await tx.servicePricing.deleteMany({
                where: { serviceId: id },
            });

            // Delete existing service coupons
            await tx.serviceCoupon.deleteMany({
                where: { serviceId: id },
            });

            // Update service and create new pricing variations & coupons
            return await tx.service.update({
                where: { id },
                data: {
                    name: val.data.name,
                    description: val.data.description || null,
                    price: val.data.price,
                    duration: val.data.duration,
                    image: val.data.image || null,
                    status: val.data.status,
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
        });

        return NextResponse.json({
            message: 'Service updated successfully',
            data: updatedService,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        // Verify service exists
        const existingService = await prisma.service.findUnique({
            where: { id },
        });

        if (!existingService) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        // Delete from the database
        await prisma.service.delete({ where: { id } });

        return NextResponse.json({
            message: 'Service deleted successfully',
            data: null,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
