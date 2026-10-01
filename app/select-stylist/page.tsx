import { Metadata } from 'next';
import { getServicesByIds, getActiveServices } from '@/repositories/services';
import { getActiveStylists } from '@/repositories/staff';
import { StylistSelector } from '@/components/frontend/stylist-selector';

export const metadata: Metadata = {
    title: 'Choose Stylist | Big Apple Barbers',
    description: 'Select your preferred barber or stylist for your haircut and shave.',
};

interface SelectStylistPageProps {
    searchParams: Promise<{
        services?: string;
    }>;
}

export default async function SelectStylistPage({ searchParams }: SelectStylistPageProps) {
    const { services: servicesParam } = await searchParams;

    const serviceIds = servicesParam
        ? servicesParam
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean)
        : [];

    let services = await getServicesByIds(serviceIds);

    // If no valid service IDs were found from query params, fetch active services
    if (services.length === 0) {
        services = await getActiveServices();
    }

    const stylists = await getActiveStylists();

    return (
        <main className="min-h-screen bg-[#141414] text-neutral-100 selection:bg-[#8a5c08] selection:text-white">
            <StylistSelector services={services} stylists={stylists} />
        </main>
    );
}
