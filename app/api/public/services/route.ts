import { NextResponse } from 'next/server';
import { getActiveServices } from '@/repositories/services';

export async function GET() {
    try {
        const services = await getActiveServices();
        return NextResponse.json({
            message: 'Services fetched successfully',
            data: services,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || 'Failed to fetch services' },
            { status: 500 }
        );
    }
}
