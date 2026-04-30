'use client';
import { PageTitle } from '@/utils/portal';

export default function DashboardPageTitle() {
    return (
        <h2 className="text-xl font-semibold">
            <PageTitle.Target />
        </h2>
    );
}
