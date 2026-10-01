'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceItem } from '@/repositories/services';
import { StylistItem } from '@/repositories/staff';
import { StickyCartHeader } from './sticky-cart-header';
import { HeroHeader } from './hero-header';
import { StylistGrid } from './stylist-grid';

interface StylistSelectorProps {
    services: ServiceItem[];
    stylists: StylistItem[];
}

export function StylistSelector({ services, stylists }: StylistSelectorProps) {
    const router = useRouter();
    const [selectedStylistId, setSelectedStylistId] = useState<string>('any');

    const totalDuration = services.reduce((acc, curr) => acc + curr.duration, 0);

    const handleSelectStylist = (stylist: StylistItem) => {
        setSelectedStylistId(stylist.id);
    };

    const handleReturn = () => {
        const query = new URLSearchParams({
            services: services.map((s) => s.id).join(','),
        });
        router.push(`/?${query.toString()}`);
    };

    const handleContinue = () => {
        if (!selectedStylistId) return;
        const query = new URLSearchParams({
            services: services.map((s) => s.id).join(','),
            stylist: selectedStylistId,
        });
        router.push(`/select-datetime?${query.toString()}`);
    };

    const selectedStylistName =
        selectedStylistId === 'any'
            ? 'Any Stylist'
            : stylists.find((s) => s.id === selectedStylistId)?.name || 'Stylist Selected';

    return (
        <div className="w-full flex flex-col">
            {/* Top Sticky Header */}
            <StickyCartHeader
                selectedServices={services}
                totalDuration={totalDuration}
                nextStepLabel="Continue"
                onContinue={handleContinue}
            />

            {/* Hero Header */}
            <HeroHeader />

            {/* Main Stylist Content */}
            <section className="w-full bg-[#141414] min-h-[calc(100vh-320px)] px-3 sm:px-6 py-8 sm:py-12">
                <div className="max-w-[760px] mx-auto">
                    {/* Header with Title and Return Button */}
                    <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white uppercase font-[family-name:var(--font-barlow)]">
                                CHOOSE STYLIST
                            </h1>
                            <p className="text-neutral-400 text-xs sm:text-sm font-[family-name:var(--font-barlow)] mt-0.5">
                                Selected:{' '}
                                <span className="text-[#d3a03e] font-medium">
                                    {selectedStylistName}
                                </span>
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleReturn}
                            className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors px-5 sm:px-6 py-1.5 sm:py-2 text-sm font-semibold rounded font-[family-name:var(--font-barlow)] cursor-pointer"
                        >
                            Return
                        </button>
                    </div>

                    {/* Stylist Grid */}
                    <StylistGrid
                        stylists={stylists}
                        selectedStylistId={selectedStylistId}
                        onSelectStylist={handleSelectStylist}
                    />
                </div>
            </section>
        </div>
    );
}
