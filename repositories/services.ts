import { prisma } from '@/app/lib/db';

export interface ServiceItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    image: string | null;
    status: 'ACTIVE' | 'INACTIVE';
}

export async function getActiveServices(): Promise<ServiceItem[]> {
    try {
        const services = await prisma.service.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'asc' },
        });

        return services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            price: s.price,
            duration: s.duration,
            image: s.image,
            status: s.status as 'ACTIVE' | 'INACTIVE',
        }));
    } catch (error) {
        console.error('Error fetching services from database:', error);
        return [];
    }
}

export async function getServicesByIds(ids: string[]): Promise<ServiceItem[]> {
    if (!ids || ids.length === 0) return [];
    try {
        const services = await prisma.service.findMany({
            where: {
                id: { in: ids },
                status: 'ACTIVE',
            },
        });

        return services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            price: s.price,
            duration: s.duration,
            image: s.image,
            status: s.status as 'ACTIVE' | 'INACTIVE',
        }));
    } catch (error) {
        console.error('Error fetching services by ids:', error);
        return [];
    }
}
