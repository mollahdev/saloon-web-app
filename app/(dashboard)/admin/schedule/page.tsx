'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import ScheduleLoading from './loading';
import { ScheduleValues } from '@/app/lib/validation/schedule';
import {
    useGetScheduleQuery,
    useUpdateScheduleMutation,
    useGetBusinessTimeOffQuery,
    useCreateBusinessTimeOffMutation,
    useUpdateBusinessTimeOffMutation,
    useDeleteBusinessTimeOffMutation,
} from '@/app/lib/store/schedule/api';
import TimeOffSection, { TimeOffData } from '@/components/dashboard/time-off-section';
import { SchedulePageHeader } from '@/components/dashboard/schedule/schedule-page-header';
import { ScheduleForm } from '@/components/dashboard/schedule/schedule-form';

export default function BusinessSchedulePage() {
    const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
    const { data: response, isLoading, error } = useGetScheduleQuery();
    const { data: timeOffRes, isLoading: isLoadingTimeOff } = useGetBusinessTimeOffQuery();
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();
    const [createTimeOff] = useCreateBusinessTimeOffMutation();
    const [updateTimeOff] = useUpdateBusinessTimeOffMutation();
    const [deleteTimeOff] = useDeleteBusinessTimeOffMutation();

    if (isLoading || isLoadingTimeOff) {
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

    const handleScheduleSubmit = async (values: ScheduleValues) => {
        try {
            const res = await updateSchedule(values).unwrap();
            toast.success(res.message || 'Business schedule updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update business schedule');
        }
    };

    const handleAddTimeOff = async (entry: TimeOffData) => {
        try {
            await createTimeOff(entry).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to add time off');
        }
    };

    const handleRemoveTimeOff = async (id: string) => {
        try {
            await deleteTimeOff(id).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to remove time off');
        }
    };

    const handleUpdateTimeOff = async (id: string, entry: TimeOffData) => {
        try {
            await updateTimeOff({ id, body: entry }).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update time off');
        }
    };

    const initialValues = {
        schedule:
            response?.data?.schedule?.map((wh: any) => ({
                ...wh,
                startTime: wh.startTime,
                endTime: wh.endTime,
            })) || [],
    };

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
                    initialValues={initialValues.schedule}
                    onSubmit={handleScheduleSubmit}
                    isLoading={isUpdating}
                    submitLabel="Update Business Schedule"
                />
            )}

            {/* Time Off */}
            {activeTab === 'timeoff' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TimeOffSection
                        initialValues={timeOffRes?.data || []}
                        onAdd={handleAddTimeOff}
                        onRemove={handleRemoveTimeOff}
                        onUpdate={handleUpdateTimeOff}
                    />
                </div>
            )}
        </div>
    );
}
