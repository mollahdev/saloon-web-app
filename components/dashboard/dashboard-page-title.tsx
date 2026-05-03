'use client';
import { PageTitle } from '@/utils/portal';

export default function DashboardPageTitle() {
    return (
        <h2 className="text-base md:text-lg font-semibold">
            <PageTitle.Target />
        </h2>
    );
}
