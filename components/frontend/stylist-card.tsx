'use client';

import Image from 'next/image';
import { StylistItem } from '@/repositories/staff';
import { FiCheck, FiUser } from 'react-icons/fi';

interface StylistCardProps {
    stylist: StylistItem;
    isSelected: boolean;
    onSelect: (stylist: StylistItem) => void;
}

export function StylistCard({ stylist, isSelected, onSelect }: StylistCardProps) {
    const isAnyBarber = stylist.id === 'any';

    return (
        <button
            type="button"
            onClick={() => onSelect(stylist)}
            aria-pressed={isSelected}
            className={`relative text-left p-2.5 sm:p-3.5 border-2 border-[#feefd8] -m-[1px] transition-all duration-200 cursor-pointer group rounded-md outline-none ${
                isSelected ? 'bg-[#feefd8]' : 'hover:bg-[#feefd8] bg-white'
            }`}
        >
            {/* Thumbnail / Avatar */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-[#f8d8a8] group-hover:border-white transition-colors duration-200 bg-neutral-100 shadow-sm flex items-center justify-center">
                {stylist.avatar ? (
                    <Image
                        src={stylist.avatar}
                        alt={stylist.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 240px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-white p-4">
                        <FiUser className="w-12 h-12 text-[#d3a03e] mb-1 stroke-[1.5]" />
                        <span className="text-[11px] tracking-wider uppercase text-neutral-300 font-semibold font-[family-name:var(--font-barlow)]">
                            {isAnyBarber ? 'Any Available' : 'Barber'}
                        </span>
                    </div>
                )}

                {/* Selected Checkmark Badge Overlay */}
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#8a5c08] text-white p-1 rounded-full shadow-md z-10 flex items-center justify-center animate-in fade-in zoom-in duration-200">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                )}
            </div>

            {/* Stylist Details */}
            <div className="pt-2 sm:pt-2.5 font-[family-name:var(--font-barlow)]">
                <h3 className="text-[#8a5c08] text-base sm:text-[18px] md:text-[19px] font-semibold leading-tight group-hover:text-[#6f4800] transition-colors">
                    {stylist.name}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm mt-0.5 line-clamp-1">
                    {stylist.position || 'Barber/Stylist'}
                </p>
                {stylist.bio && (
                    <p className="text-neutral-400 text-[11px] mt-0.5 line-clamp-1">
                        {stylist.bio}
                    </p>
                )}
            </div>
        </button>
    );
}
