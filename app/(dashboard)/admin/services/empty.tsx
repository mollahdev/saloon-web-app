import { Button } from '@mantine/core';
import { HiOutlinePlus, HiOutlineClock } from 'react-icons/hi';
import { LuScissors } from 'react-icons/lu';
import { RiCoupon2Line } from 'react-icons/ri';
import Link from 'next/link';

export default function ServicesEmpty() {
    return (
        <div className="relative max-w-3xl mx-auto my-6 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden p-8 md:p-12 text-center flex flex-col items-center">
            {/* Glowing background blur */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Central Illustration Area */}
            <div className="relative mb-8 mt-4 select-none">
                {/* Background decorative circles */}
                <div className="absolute inset-0 -m-6 rounded-full border border-dashed border-gray-200/60 animate-[spin_80s_linear_infinite] pointer-events-none" />
                <div className="absolute inset-0 -m-12 rounded-full border border-dotted border-gray-100/80 animate-[spin_120s_linear_infinite_reverse] pointer-events-none" />

                {/* Main Icon Container */}
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-primary/10 to-blue-500/5 border border-primary/20 text-primary shadow-xs">
                    <LuScissors size={36} className="text-primary/90" />

                    {/* Ring Pulse Effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-60 pointer-events-none" />
                </div>

                {/* Floating Badge 1: Clock (Top Left) */}
                <div className="absolute -top-3 -left-8 bg-amber-50 text-amber-600 border border-amber-100/50 p-2.5 rounded-xl shadow-[0_4px_12px_rgba(245,158,11,0.08)] flex items-center justify-center rotate-[-10deg] hover:rotate-0 hover:scale-110 transition-all duration-300">
                    <HiOutlineClock size={20} />
                </div>

                {/* Floating Badge 2: Coupon (Bottom Right) */}
                <div className="absolute -bottom-2 -right-8 bg-purple-50 text-purple-600 border border-purple-100/50 p-2.5 rounded-xl shadow-[0_4px_12px_rgba(147,51,234,0.08)] flex items-center justify-center rotate-[12deg] hover:rotate-0 hover:scale-110 transition-all duration-300">
                    <RiCoupon2Line size={20} />
                </div>
            </div>

            {/* Typography */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-3">
                No Services Found
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
                Add services to your directory. You&apos;ll be able to specify names, descriptions,
                prices, and session durations for customers to select during appointments.
            </p>

            {/* Action Button */}
            <Button
                component={Link}
                href="/admin/services/new"
                id="add-first-service-btn"
                size="md"
                radius="md"
                leftSection={<HiOutlinePlus size={18} />}
                className="bg-primary hover:bg-primary/90 text-white font-semibold transition-all px-6 py-2.5 shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
            >
                Add Your First Service
            </Button>
        </div>
    );
}
