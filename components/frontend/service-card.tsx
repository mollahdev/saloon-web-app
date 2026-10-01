'use client';

import Image from 'next/image';
import { ServiceItem } from '@/repositories/services';
import { FiCheck, FiClock } from 'react-icons/fi';

interface ServiceCardProps {
    service: ServiceItem;
    isSelected: boolean;
    onSelect: (service: ServiceItem) => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
    const imageSrc = service.image || '/placeholder.svg';

    return (
        <button
            type="button"
            onClick={() => onSelect(service)}
            aria-pressed={isSelected}
            className={`relative text-left p-2.5 sm:p-3.5 border-2 border-[#feefd8] -m-[1px] transition-all duration-200 cursor-pointer group rounded-md outline-none ${
                isSelected ? 'bg-[#feefd8]' : 'hover:bg-[#feefd8] bg-white'
            }`}
        >
            {/* Thumbnail Image Container */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-[#f8d8a8] group-hover:border-white transition-colors duration-200 bg-neutral-100 shadow-sm">
                <Image
                    src={imageSrc}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 240px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {/* Selected Icon Overlay over thumbnail */}
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#8a5c08] text-white p-1 rounded-full shadow-md z-10 flex items-center justify-center animate-in fade-in zoom-in duration-200">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                )}
            </div>

            {/* Service Content */}
            <div className="pt-2 sm:pt-2.5">
                <h2 className="text-[#8a5c08] text-base sm:text-[18px] md:text-[19px] font-semibold leading-tight font-[family-name:var(--font-barlow)] group-hover:text-[#6f4800] transition-colors">
                    {service.name.trim()}
                </h2>
                <div className="flex items-center gap-1 text-neutral-500 text-xs sm:text-sm mt-1 font-[family-name:var(--font-barlow)]">
                    <FiClock className="w-3.5 h-3.5 text-[#d3a03e]" />
                    <span>{service.duration} min</span>
                </div>
            </div>
        </button>
    );
}
