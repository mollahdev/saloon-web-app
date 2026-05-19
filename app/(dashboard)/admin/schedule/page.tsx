'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import ScheduleLoading from './loading';
import { ScheduleValues } from '@/app/lib/validation/schedule';
import { useGetScheduleQuery, useUpdateScheduleMutation } from '@/app/lib/store/schedule/api';
import TimeOffSection from '@/components/dashboard/time-off-section';
import { SchedulePageHeader } from '@/components/dashboard/schedule/schedule-page-header';
import { ScheduleForm } from '@/components/dashboard/schedule/schedule-form';

export default function BusinessSchedulePage() {
    const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
    const { data: response, isLoading, error } = useGetScheduleQuery();
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();

    if (isLoading) {
        return (
            <>
                <PageTitle.Source>Business Schedule</PageTitle.Source>
                <ScheduleLoading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle.Source>Business Schedule</PageTitle.Source>
                <div className="max-w-3xl w-full">
                    <div className="bg-red-50 p-6 rounded-xl text-red-600 text-center">
                        Failed to load business schedule. Please try again later.
                    </div>
                </div>
            </>
        );
    }

    const handleSubmit = async (values: ScheduleValues) => {
        try {
            const res = await updateSchedule(values).unwrap();
            toast.success(res.message || 'Business schedule updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update business schedule');
        }
    };

    const initialValues =
        response?.data?.schedule?.map((wh: any) => ({
            ...wh,
            startTime: wh.startTime,
            endTime: wh.endTime,
        })) || [];

    return (
        <div className="max-w-3xl w-full pb-10">
            <SchedulePageHeader
                title="Business Schedule"
                description="Configure the general opening hours and business-wide time off."
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'schedule', label: 'Opening Hours' },
                    { id: 'timeoff', label: 'Business Closures' },
                ]}
            />

            {/* Weekly Schedule */}
            {activeTab === 'schedule' && (
                <ScheduleForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                    submitLabel="Update Business Schedule"
                />
            )}

            {/* Time Off */}
            {activeTab === 'timeoff' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TimeOffSection staffId="business" />
                </div>
            )}
        </div>
    );
}
