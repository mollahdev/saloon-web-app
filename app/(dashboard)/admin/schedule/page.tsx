'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import ScheduleLoading from './loading';
import { WorkingHoursValues } from '@/app/lib/validation/working-hours';
import {
    useGetWorkingHoursQuery,
    useUpdateWorkingHoursMutation,
} from '@/app/lib/store/working-hours/api';
import { defaultWorkingHours } from '@/constants';
import TimeOffSection from '@/components/dashboard/TimeOffSection';
import { SchedulePageHeader } from '@/components/dashboard/schedule/SchedulePageHeader';
import { WorkingHoursForm } from '@/components/dashboard/schedule/WorkingHoursForm';

export default function BusinessSchedulePage() {
    const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
    const { data: response, isLoading, error } = useGetWorkingHoursQuery();
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateWorkingHoursMutation();

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

    const handleSubmit = async (values: WorkingHoursValues) => {
        try {
            const res = await updateSchedule(values).unwrap();
            toast.success(res.message || 'Business schedule updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update business schedule');
        }
    };

    const initialValues =
        response?.data?.workingHours?.map((wh: any) => ({
            ...wh,
            startTime: wh.startTime.substring(0, 5),
            endTime: wh.endTime.substring(0, 5),
        })) ||
        defaultWorkingHours.map((wh) => ({
            ...wh,
            startTime: wh.startTime.substring(0, 5),
            endTime: wh.endTime.substring(0, 5),
        }));

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
                <WorkingHoursForm
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
