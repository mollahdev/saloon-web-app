'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ServiceItem } from '@/repositories/services';
import { FiX, FiClock, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedServices: ServiceItem[];
    totalDuration: number;
    onRemoveService?: (serviceId: string) => void;
    onClearAll?: () => void;
    onContinue?: () => void;
    nextStepLabel?: string;
}

export function CartDrawer({
    isOpen,
    onClose,
    selectedServices,
    totalDuration,
    onRemoveService,
    onClearAll,
    onContinue,
    nextStepLabel = 'Select Stylist',
}: CartDrawerProps) {
    const count = selectedServices.length;
    const [mounted, setMounted] = useState(isOpen);
    const [visible, setVisible] = useState(isOpen);

    // Synchronize mounted state during render when opening
    if (isOpen && !mounted) {
        setMounted(true);
    }

    // Smooth transition handling for entry and exit
    useEffect(() => {
        if (isOpen) {
            const raf = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setVisible(true);
                });
            });
            return () => cancelAnimationFrame(raf);
        }

        const timer = setTimeout(() => {
            setMounted(false);
        }, 300);

        const raf = requestAnimationFrame(() => {
            setVisible(false);
        });

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(raf);
        };
    }, [isOpen]);

    // Handle Escape key to close drawer and body overflow
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Backdrop with smooth fade */}
            <div
                className={`fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
                    visible ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Drawer with hardware-accelerated translateX slide */}
            <div
                className={`relative z-10 w-full max-w-[380px] sm:max-w-[420px] bg-[#141414] text-white h-full shadow-2xl flex flex-col border-l border-[#8a5c08]/50 transform transition-transform duration-300 ease-out will-change-transform ${
                    visible ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#8a5c08]/20 border border-[#d3a03e]/40 flex items-center justify-center text-[#d3a03e]">
                            <FiShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold font-[family-name:var(--font-barlow)] tracking-wide">
                                Selected Services
                            </h2>
                            <p className="text-xs text-neutral-400 font-[family-name:var(--font-barlow)]">
                                {count} {count === 1 ? 'service' : 'services'} in your cart
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close drawer"
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                    >
                        <FiX className="w-5 h-5 stroke-[2.5]" />
                    </button>
                </div>

                {/* Drawer Body - List of Services */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {count === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                            <FiShoppingBag className="w-12 h-12 text-neutral-600 mb-3 stroke-[1.5]" />
                            <p className="text-base font-semibold text-neutral-300 font-[family-name:var(--font-barlow)]">
                                Your cart is empty
                            </p>
                            <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
                                Tap on any service in the list to add it to your visit.
                            </p>
                        </div>
                    ) : (
                        selectedServices.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-[#8a5c08]/50 transition-all duration-150 group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Thumbnail */}
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                                        <Image
                                            src={service.image || '/placeholder.svg'}
                                            alt={service.name}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-semibold text-neutral-100 truncate font-[family-name:var(--font-barlow)]">
                                            {service.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-[#d3a03e] mt-0.5 font-[family-name:var(--font-barlow)]">
                                            <FiClock className="w-3 h-3" />
                                            <span>{service.duration} min</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                {onRemoveService && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveService(service.id)}
                                        aria-label={`Remove ${service.name}`}
                                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 rounded-md transition-colors shrink-0 cursor-pointer"
                                        title="Remove service"
                                    >
                                        <FiTrash2 className="w-4 h-4 stroke-[2]" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Drawer Footer */}
                {count > 0 && (
                    <div className="p-5 border-t border-neutral-800 bg-neutral-950/90 space-y-4">
                        {/* Summary Info */}
                        <div className="flex items-center justify-between text-sm font-[family-name:var(--font-barlow)]">
                            <span className="text-neutral-400">Total Duration</span>
                            <div className="flex items-center gap-1.5 font-bold text-[#f5c358]">
                                <FiClock className="w-4 h-4 text-[#d3a03e]" />
                                <span>{totalDuration} min</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {onClearAll && (
                                <button
                                    type="button"
                                    onClick={onClearAll}
                                    className="px-3.5 py-2.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-red-400 hover:border-red-500/50 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    if (onContinue) onContinue();
                                }}
                                className="flex-1 py-3 px-5 rounded-full bg-[#8a5c08] hover:bg-[#a6700a] text-white font-extrabold text-sm uppercase tracking-wide border-2 border-[#fde047] shadow-[0_0_20px_rgba(253,224,71,0.4)] hover:shadow-[0_0_28px_rgba(253,224,71,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{nextStepLabel}</span>
                                <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
