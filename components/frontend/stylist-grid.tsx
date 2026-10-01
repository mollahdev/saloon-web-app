'use client';

import { StylistItem } from '@/repositories/staff';
import { StylistCard } from './stylist-card';

interface StylistGridProps {
    stylists: StylistItem[];
    selectedStylistId: string | null;
    onSelectStylist: (stylist: StylistItem) => void;
}

export function StylistGrid({ stylists, selectedStylistId, onSelectStylist }: StylistGridProps) {
    // Include "Any Stylist" option at the front of the list
    const allStylists: StylistItem[] = [
        {
            id: 'any',
            name: 'Any Stylist',
            position: 'First Available Barber',
            avatar: null,
            bio: 'Fastest booking option',
        },
        ...stylists,
    ];

    return (
        <div className="bg-white rounded-xl shadow-md border-2 border-[#feefd8] p-3 sm:p-5 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3.5">
                {allStylists.map((stylist) => (
                    <StylistCard
                        key={stylist.id}
                        stylist={stylist}
                        isSelected={selectedStylistId === stylist.id}
                        onSelect={onSelectStylist}
                    />
                ))}
            </div>
        </div>
    );
}
