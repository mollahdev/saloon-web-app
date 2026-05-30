'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import { useDisclosure } from '@mantine/hooks';
import { useConfirmation } from '@/hooks/use-confirmation';
import ScheduleLoading from '../loading';
import { ScheduleValues } from '@/app/lib/validation/schedule';
import {
    useGetStaffScheduleQuery,
    useUpdateStaffScheduleMutation,
} from '@/app/lib/store/staffs/api';
import {
    useGetTimeOffsQuery,
    useCreateTimeOffMutation,
    useUpdateTimeOffMutation,
    useDeleteTimeOffMutation,
} from '@/app/lib/store/staffs/time-off-api';
import { TimeOffFormValues } from '@/app/lib/validation/time-off';
import { defaultSchedule } from '@/constants';
import TimeOffSection, { TimeOffData } from '@/components/dashboard/time-off-section';
import { SchedulePageHeader } from '@/components/dashboard/schedule/schedule-page-header';
import { ScheduleForm } from '@/components/dashboard/schedule/schedule-form';

export default function StaffSchedulePage() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
    const { data: response, isLoading, error } = useGetStaffScheduleQuery(id);
    const { data: timeOffRes, isLoading: isLoadingTimeOff } = useGetTimeOffsQuery(id);
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateStaffScheduleMutation();
    const [createTimeOff] = useCreateTimeOffMutation();
    const [updateTimeOff] = useUpdateTimeOffMutation();
    const [deleteTimeOff] = useDeleteTimeOffMutation();
    const staff = response?.data?.staff;

    // Time off modal state — managed here, passed down to TimeOffSection
    const [opened, { open, close }] = useDisclosure(false);
    const [editingEntry, setEditingEntry] = useState<TimeOffData | null>(null);
    const { confirm } = useConfirmation();

    const initialValues = useMemo(() => {
        return (
            response?.data?.schedule?.map((wh: any) => ({
                ...wh,
                startTime: wh.startTime.substring(0, 5),
                endTime: wh.endTime.substring(0, 5),
            })) ||
            defaultSchedule.map((wh) => ({
                ...wh,
                startTime: wh.startTime.substring(0, 5),
                endTime: wh.endTime.substring(0, 5),
            }))
        );
    }, [response?.data?.schedule]);

    if (isLoading || isLoadingTimeOff) {
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
                const res = await updateTimeOff({
                    staffId: id,
                    timeOffId: editingEntry.id,
                    body: entry as TimeOffFormValues,
                }).unwrap();
                toast.success(res.message || 'Time off updated successfully');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Failed to update time off');
            }
        } else {
            try {
                const res = await createTimeOff({
                    staffId: id,
                    body: entry as TimeOffFormValues,
                }).unwrap();
                toast.success(res.message || 'Time off added successfully');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Failed to add time off');
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
                        const res = await deleteTimeOff({
                            staffId: id,
                            timeOffId: entry.id,
                        }).unwrap();
                        toast.success(res.message || 'Time off deleted successfully');
                    }
                } catch (err: any) {
                    toast.error(err?.data?.message || 'Failed to remove time off');
                }
            },
        });
    };

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
                    { id: 'schedule', label: 'Schedule' },
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
            {activeTab === 'timeoff' && (
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
            )}
        </div>
    );
}
