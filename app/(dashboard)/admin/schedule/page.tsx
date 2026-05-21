'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import { useDisclosure } from '@mantine/hooks';
import { useConfirmation } from '@/hooks/use-confirmation';
import { workingDayOptions } from '@/constants';
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

    // Time off modal state — managed here, passed down to TimeOffSection
    const [opened, { open, close }] = useDisclosure(false);
    const [editingEntry, setEditingEntry] = useState<TimeOffData | null>(null);
    const { confirm } = useConfirmation();

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
            toast.success(res.message);
        } catch (err: any) {
            toast.error(err?.data?.message);
        }
    };

    const handleOpenAdd = () => {
        setEditingEntry(null);
        open();
    };

    const handleEdit = (entry: TimeOffData) => {
        setEditingEntry(entry);
        open();
    };

    const handleModalSubmit = async (entry: TimeOffData) => {
        if (editingEntry?.id) {
            try {
                const res = await updateTimeOff({ id: editingEntry.id, body: entry }).unwrap();
                toast.success(res.message || 'Time off updated successfully');
            } catch (err: any) {
                toast.error(err?.data?.message);
            }
        } else {
            try {
                const res = await createTimeOff(entry).unwrap();
                toast.success(res.message);
            } catch (err: any) {
                toast.error(err?.data?.message);
            }
        }
        setEditingEntry(null);
    };

    const handleDelete = (entry: TimeOffData) => {
        confirm({
            title: 'Delete Time Off',
            message: `Are you sure you want to delete "${entry.title}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            color: 'red',
            onConfirm: async () => {
                try {
                    if (entry.id) {
                        const res = await deleteTimeOff(entry.id).unwrap();
                        toast.success(res.message);
                    }
                } catch (err: any) {
                    toast.error(err?.data?.message);
                }
            },
        });
    };

    const initialValues = {
        schedule:
            response?.data?.schedule
                ?.map((wh: any) => ({
                    ...wh,
                    startTime: wh.startTime,
                    endTime: wh.endTime,
                }))
                .sort(
                    (a: any, b: any) =>
                        workingDayOptions.indexOf(a.dayOfWeek) -
                        workingDayOptions.indexOf(b.dayOfWeek)
                ) || [],
    };

    return (
        <div className="max-w-3xl w-full pb-10">
            <SchedulePageHeader
                title="Business Schedule"
                description="Configure the general opening hours and business-wide time off."
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'schedule', label: 'Schedule' },
                    { id: 'timeoff', label: 'Time Off' },
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
                        entries={timeOffRes?.data || []}
                        opened={opened}
                        editingEntry={editingEntry}
                        onOpenAdd={handleOpenAdd}
                        onEdit={handleEdit}
                        onClose={close}
                        onSubmit={handleModalSubmit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
}
