'use client';

import { useState } from 'react';
import { ServiceItem } from '@/repositories/services';
import { useRouter } from 'next/navigation';
import { FiClock, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { CartDrawer } from './cart-drawer';

interface StickyCartHeaderProps {
    selectedServices: ServiceItem[];
    totalDuration: number;
    onRemoveService?: (serviceId: string) => void;
    onClearAll?: () => void;
    onContinue?: () => void;
    nextStepLabel?: string;
    nextStepHref?: string;
}

export function StickyCartHeader({
    selectedServices,
    totalDuration,
    onRemoveService,
    onClearAll,
    onContinue,
    nextStepLabel = 'Continue to Stylist',
    nextStepHref,
}: StickyCartHeaderProps) {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const count = selectedServices.length;

    const handleContinue = () => {
        if (count === 0) return;
        if (onContinue) {
            onContinue();
        } else {
            const query = new URLSearchParams({
                services: selectedServices.map((s) => s.id).join(','),
            });
            const targetHref = nextStepHref || `/select-stylist?${query.toString()}`;
            router.push(targetHref);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-[#8a5c08]/50 shadow-[0_8px_30px_rgba(0,0,0,0.75)] transition-all">
                {/* Top gold metallic accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d3a03e] to-transparent opacity-90" />

                <div className="max-w-[820px] mx-auto px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 min-h-[58px]">
                    {/* Left side: Cart Icon with Round Circle Badge & Duration */}
                    <div className="flex items-center gap-2 sm:gap-3 font-[family-name:var(--font-barlow)]">
                        {/* Cart Trigger Button - Icon only with round circle badge */}
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label={`View selected services cart with ${count} items`}
                            className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 border border-[#8a5c08]/60 hover:border-[#fde047] hover:bg-neutral-800 transition-all duration-200 cursor-pointer shadow-sm group active:scale-95"
                        >
                            <FiShoppingBag className="w-5 h-5 text-[#d3a03e] group-hover:scale-110 transition-transform duration-200" />
                            {count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#fde047] text-neutral-950 text-[11px] font-black flex items-center justify-center shadow-md animate-in zoom-in duration-150">
                                    {count}
                                </span>
                            )}
                        </button>

                        {/* Total Duration Badge */}
                        {count > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1e170c] text-white border border-[#d3a03e]/60 text-xs sm:text-sm font-bold shadow-[0_0_12px_rgba(211,160,62,0.2)] shrink-0">
                                <FiClock className="w-3.5 h-3.5 text-[#d3a03e] animate-pulse" />
                                <span>{totalDuration} min</span>
                            </div>
                        )}
                    </div>

                    {/* Right side: Next / Continue button */}
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={count === 0}
                        aria-label="Continue to select stylist"
                        className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-200 flex items-center gap-2 font-[family-name:var(--font-barlow)] ${
                            count > 0
                                ? 'bg-[#8a5c08] hover:bg-[#a6700a] text-white border-2 border-[#fde047] shadow-[0_0_20px_rgba(253,224,71,0.55)] hover:shadow-[0_0_30px_rgba(253,224,71,0.85)] hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#8a5c08]/50'
                                : 'bg-[#2a2a2a] text-white border border-[#404040] cursor-not-allowed shadow-none'
                        }`}
                    >
                        <span className="text-white drop-shadow-xs">{nextStepLabel}</span>
                        <FiArrowRight
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] text-white ${
                                count > 0 ? 'animate-pulse' : 'text-neutral-300'
                            }`}
                        />
                    </button>
                </div>
            </header>

            {/* Cart Slide-over Drawer */}
            <CartDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                selectedServices={selectedServices}
                totalDuration={totalDuration}
                onRemoveService={onRemoveService}
                onClearAll={onClearAll}
                onContinue={handleContinue}
                nextStepLabel={nextStepLabel}
            />
        </>
    );
}
