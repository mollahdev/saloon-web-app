'use client';
import { SimpleGrid, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { size } from 'lodash';
/**
 * Internal dependencies
 */
import StaffsLoading from './loading';
import StaffsEmpty from './empty';
import { PageTitle } from '@/utils/portal';
import { useGetStaffsQuery } from '@/app/lib/store/staffs/api';
import { StaffCard } from '@/components/dashboard/staff-card';
import CreateStaffModal from '@/components/dashboard/create-staff-modal';

export default function StaffsPage() {
    const { data: response, isLoading, error } = useGetStaffsQuery();
    const staffs = response?.data || [];
    const [opened, { open, close }] = useDisclosure(false);

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

            {size(staffs) !== 0 && (
                <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Staff Members</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage saloon staff and scheduling
                        </p>
                    </div>
                    <Button id="create-staff-btn" onClick={open} size="md">
                        Create Staff
                    </Button>
                </div>
            )}

            {size(staffs) === 0 ? (
                <StaffsEmpty onCreateClick={open} />
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

            <CreateStaffModal opened={opened} onClose={close} />
        </div>
    );
}
