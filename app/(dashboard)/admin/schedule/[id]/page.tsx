'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import ScheduleLoading from '../loading';
import { ScheduleValues } from '@/app/lib/validation/schedule';
import {
    useGetStaffScheduleQuery,
    useUpdateStaffScheduleMutation,
} from '@/app/lib/store/staffs/schedule-api';
import { defaultSchedule } from '@/constants';
import TimeOffSection from '@/components/dashboard/time-off-section';
import { SchedulePageHeader } from '@/components/dashboard/schedule/schedule-page-header';
import { ScheduleForm } from '@/components/dashboard/schedule/schedule-form';

export default function StaffSchedulePage() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
    const { data: response, isLoading, error } = useGetStaffScheduleQuery(id);
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateStaffScheduleMutation();
    const staff = response?.data?.staff;

    if (isLoading) {
        return (
            <>
                <PageTitle.Source>Schedule</PageTitle.Source>
                <ScheduleLoading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle.Source>Schedule</PageTitle.Source>
                <div className="max-w-3xl w-full">
                    <div className="bg-red-50 p-6 rounded-xl text-red-600 text-center">
                        Failed to load schedule. Please try again later.
                    </div>
                </div>
            </>
        );
    }

    const handleSubmit = async (values: ScheduleValues) => {
        try {
            const res = await updateSchedule({ staffId: id, body: values }).unwrap();
            toast.success(res.message || 'Schedule updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update schedule');
        }
    };

    const initialValues =
        response?.data?.schedule?.map((wh: any) => ({
            ...wh,
            startTime: wh.startTime.substring(0, 5),
            endTime: wh.endTime.substring(0, 5),
        })) ||
        defaultSchedule.map((wh) => ({
            ...wh,
            startTime: wh.startTime.substring(0, 5),
            endTime: wh.endTime.substring(0, 5),
        }));

    return (
        <div className="max-w-3xl w-full pb-10">
            <SchedulePageHeader
                title={staff?.name || 'Staff Schedule'}
                description={
                    staff
                        ? `Configure weekly hours and time off for ${staff.name}.`
                        : 'Configure staff member schedule.'
                }
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'schedule', label: 'Weekly Schedule' },
                    { id: 'timeoff', label: 'Time Off' },
                ]}
            />

            {/* Weekly Schedule */}
            {activeTab === 'schedule' && (
                <ScheduleForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                    submitLabel="Update Schedule"
                />
            )}

            {/* Time Off */}
            {activeTab === 'timeoff' && <TimeOffSection initialValues={[]} />}
        </div>
    );
}
