'use client';
import { SimpleGrid, Text } from '@mantine/core';
/**
 * Internal dependencies
 */
import StaffsLoading from './loading';
import { PageTitle } from '@/utils/portal';
import { useGetStaffsQuery } from '@/app/lib/store/staffs/api';
import { StaffCard } from '@/components/dashboard/StaffCard';

export default function StaffsPage() {
    const { data: response, isLoading, error } = useGetStaffsQuery();
    const staffs = response?.data || [];

    if (isLoading) {
        return (
            <>
                <PageTitle.Source>Staffs</PageTitle.Source>
                <StaffsLoading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle.Source>Staffs</PageTitle.Source>
                <div className="bg-red-50 p-4 rounded-lg text-red-600">
                    Failed to load staffs. Please try again later.
                </div>
            </>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto w-full">
            <PageTitle.Source>Staffs</PageTitle.Source>

            {staffs.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
                    <Text c="dimmed">No staff members found.</Text>
                </div>
            ) : (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                    spacing="lg"
                    verticalSpacing="lg"
                >
                    {staffs.map((staff) => (
                        <StaffCard key={staff.id} staff={staff} />
                    ))}
                </SimpleGrid>
            )}
        </div>
    );
}
