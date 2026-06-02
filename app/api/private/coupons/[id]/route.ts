import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus, isAdminOrOwner } from '@/app/lib/permissions';
import { couponSchema } from '@/app/lib/validation/coupon';

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

        const coupon = await prisma.coupon.findUnique({
            where: { id },
            include: {
                services: true,
                excludeServices: true,
                staffs: true,
                excludeStaffs: true,
            },
        });

        if (!coupon) {
            return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Coupon fetched successfully',
            data: coupon,
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

        // Verify coupon exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: { id },
        });

        if (!existingCoupon) {
            return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
        }

        // Check duplicate code (excluding the current one)
        const duplicateCoupon = await prisma.coupon.findFirst({
            where: {
                code: val.data.code,
                NOT: { id },
            },
        });

        if (duplicateCoupon) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: { code: ['Coupon code already exists'] },
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

        const parsedExpiry = expiryDate ? new Date(expiryDate) : null;

        const updatedCoupon = await prisma.coupon.update({
            where: { id },
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
                services: {
                    set: services ? services.map((id) => ({ id })) : [],
                },
                excludeServices: {
                    set: excludeServices ? excludeServices.map((id) => ({ id })) : [],
                },
                staffs: {
                    set: staffs ? staffs.map((id) => ({ id })) : [],
                },
                excludeStaffs: {
                    set: excludeStaffs ? excludeStaffs.map((id) => ({ id })) : [],
                },
            },
            include: {
                services: true,
                excludeServices: true,
                staffs: true,
                excludeStaffs: true,
            },
        });

        return NextResponse.json({
            message: 'Coupon updated successfully',
            data: updatedCoupon,
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

        // Verify coupon exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: { id },
        });

        if (!existingCoupon) {
            return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
        }

        // Delete from the database
        await prisma.coupon.delete({ where: { id } });

        return NextResponse.json({
            message: 'Coupon deleted successfully',
            data: null,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
