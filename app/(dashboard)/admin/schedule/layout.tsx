'use client';
import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { useGetStaffsQuery } from '@/app/lib/store/staffs/api';
import { StaffSidebar } from '@/components/dashboard/schedule/staff-sidebar';

export default function ScheduleLayout({ children }: PropsWithChildren) {
    const { data: response, isLoading } = useGetStaffsQuery();
    const pathname = usePathname();
    const staffs = response?.data || [];

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 max-w-[1400px] mx-auto w-full h-full">
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <StaffSidebar staffs={staffs} isLoading={isLoading} pathname={pathname} />

            {/* Main Content */}
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    );
}
