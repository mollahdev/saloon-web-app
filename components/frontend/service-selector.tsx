'use client';

import { useState } from 'react';
import { ServiceItem } from '@/repositories/services';
import { StickyCartHeader } from './sticky-cart-header';
import { HeroHeader } from './hero-header';
import { ServiceGrid } from './service-grid';

interface ServiceSelectorProps {
    services: ServiceItem[];
    initialSelectedIds?: string[];
}

export function ServiceSelector({ services, initialSelectedIds = [] }: ServiceSelectorProps) {
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(initialSelectedIds);

    const handleSelectService = (service: ServiceItem) => {
        setSelectedServiceIds((prev) =>
            prev.includes(service.id)
                ? prev.filter((id) => id !== service.id)
                : [...prev, service.id]
        );
    };

    const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
    const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.duration, 0);

    return (
        <div className="w-full flex flex-col">
            {/* Top Sticky Header */}
            <StickyCartHeader
                selectedServices={selectedServices}
                totalDuration={totalDuration}
                nextStepLabel="Select Stylist"
                onRemoveService={(id) =>
                    setSelectedServiceIds((prev) => prev.filter((serviceId) => serviceId !== id))
                }
                onClearAll={() => setSelectedServiceIds([])}
            />

            {/* Hero Header */}
            <HeroHeader />

            {/* Main Service Content */}
            <section className="w-full bg-[#141414] min-h-[calc(100vh-320px)] px-3 sm:px-6 py-8 sm:py-12">
                <div className="max-w-[760px] mx-auto">
                    <ServiceGrid
                        services={services}
                        selectedServiceIds={selectedServiceIds}
                        onSelectService={handleSelectService}
                    />
                </div>
            </section>
        </div>
    );
}
