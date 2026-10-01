import { Metadata } from 'next';
import { getActiveServices } from '@/repositories/services';
import { ServiceSelector } from '@/components/frontend/service-selector';
import { projectData } from '@/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: `${projectData.title} | Select Service - Haircuts & Shaves`,
    description:
        'Choose your desired barber service at Big Apple Barbershop. Professional haircuts, hot towel shaves, beard trims, and styling in New York.',
};

interface HomeProps {
    searchParams?: Promise<{
        services?: string;
    }>;
}

export default async function Home(props: HomeProps) {
    const searchParams = props.searchParams ? await props.searchParams : undefined;
    const initialSelectedIds = searchParams?.services
        ? searchParams.services
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean)
        : [];

    const services = await getActiveServices();

    return (
        <main className="min-h-screen bg-[#141414] text-white flex flex-col">
            <ServiceSelector services={services} initialSelectedIds={initialSelectedIds} />
        </main>
    );
}
