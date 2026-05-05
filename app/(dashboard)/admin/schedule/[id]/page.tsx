'use client';
import {
    Button,
    Divider,
    TextInput,
    Switch,
    Stack,
    Text,
    Avatar,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { PageTitle } from '@/utils/portal';
import ScheduleLoading from './loading';
import { workingHoursSchema, WorkingHoursValues } from '@/app/lib/validation/working-hours';
import {
    useGetStaffScheduleQuery,
    useUpdateStaffScheduleMutation,
} from '@/app/lib/store/staffs/schedule-api';
import { defaultWorkingHours } from '@/constants';

const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
};

export default function StaffSchedulePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: response, isLoading, error } = useGetStaffScheduleQuery(id);
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateStaffScheduleMutation();
    const staff = response?.data?.staff;

    const form = useForm<WorkingHoursValues>({
        initialValues: {
            workingHours: defaultWorkingHours.map((wh) => ({
                ...wh,
                startTime: wh.startTime.substring(0, 5),
                endTime: wh.endTime.substring(0, 5),
            })),
        },
        validate: schemaResolver(workingHoursSchema),
    });

    useEffect(() => {
        if (response?.data?.workingHours) {
            form.setValues({
                workingHours: response.data.workingHours.map((wh: any) => ({
                    ...wh,
                    startTime: wh.startTime.substring(0, 5),
                    endTime: wh.endTime.substring(0, 5),
                })),
            });
        }
    }, [response]);

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
                <div className="max-w-3xl mx-auto w-full">
                    <div className="bg-red-50 p-6 rounded-xl text-red-600 text-center">
                        Failed to load schedule. Please try again later.
                    </div>
                </div>
            </>
        );
    }

    const handleSubmit = async (values: WorkingHoursValues) => {
        try {
            const res = await updateSchedule({ staffId: id, body: values }).unwrap();
            toast.success(res.message || 'Schedule updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update schedule');
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <PageTitle.Source>{staff?.name}</PageTitle.Source>

            {/* Header with back button and staff info */}
            <div className="flex items-center gap-4 mb-6">
                <Tooltip label="Back to Staffs" withArrow>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="lg"
                        onClick={() => router.push('/admin/staffs')}
                        className="transition-colors hover:bg-gray-100"
                    >
                        <HiOutlineArrowLeft size={20} />
                    </ActionIcon>
                </Tooltip>

                {staff && (
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={staff.avatar}
                            size={44}
                            radius={44}
                            color="primary"
                            className="border-2 border-gray-100"
                        />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-lg font-bold text-gray-800 tracking-tight leading-tight">
                                {staff.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {staff.position || 'Specialist'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Working hours form */}
            <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                    <Stack gap={0}>
                        {form.values.workingHours.map((item, index) => (
                            <div
                                key={item.dayOfWeek}
                                className="transition-colors hover:bg-gray-50/50"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-2 md:p-3">
                                    <div className="flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-start gap-6 sm:gap-12 flex-1">
                                        <div className="sm:w-32 text-right sm:text-left">
                                            <Text fw={700} size="md" className="tracking-tight">
                                                {formatDayName(item.dayOfWeek)}
                                            </Text>
                                        </div>
                                        <Switch
                                            label={item.isOffDay ? 'Closed' : 'Open'}
                                            checked={!item.isOffDay}
                                            onChange={(event) =>
                                                form.setFieldValue(
                                                    `workingHours.${index}.isOffDay`,
                                                    !event.currentTarget.checked
                                                )
                                            }
                                            color="teal"
                                            size="md"
                                            styles={{
                                                track: { cursor: 'pointer' },
                                                label: {
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    color: item.isOffDay
                                                        ? 'var(--mantine-color-red-6)'
                                                        : 'var(--mantine-color-teal-6)',
                                                    cursor: 'pointer',
                                                    width: 60,
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                                        <TextInput
                                            type="time"
                                            label="Opening"
                                            size="sm"
                                            disabled={item.isOffDay}
                                            className="time-picker-no-icon w-[48%] sm:w-36"
                                            onClick={(event) => event.currentTarget.showPicker()}
                                            styles={{
                                                input: { cursor: 'pointer' },
                                                label: {
                                                    marginBottom: 4,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: 'var(--mantine-color-gray-5)',
                                                },
                                            }}
                                            {...form.getInputProps(
                                                `workingHours.${index}.startTime`
                                            )}
                                        />
                                        <TextInput
                                            type="time"
                                            label="Closing"
                                            size="sm"
                                            disabled={item.isOffDay}
                                            className="time-picker-no-icon w-[48%] sm:w-36"
                                            onClick={(event) => event.currentTarget.showPicker()}
                                            styles={{
                                                input: { cursor: 'pointer' },
                                                label: {
                                                    marginBottom: 4,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: 'var(--mantine-color-gray-5)',
                                                },
                                            }}
                                            {...form.getInputProps(`workingHours.${index}.endTime`)}
                                        />
                                    </div>
                                </div>
                                {index < form.values.workingHours.length - 1 && (
                                    <Divider variant="dashed" color="gray.2" />
                                )}
                            </div>
                        ))}
                    </Stack>

                    <Divider my="lg" color="gray.1" />

                    <div className="flex justify-end pb-2">
                        <Button
                            type="submit"
                            size="md"
                            loading={isUpdating}
                            loaderProps={{ type: 'dots' }}
                            className="w-full sm:w-auto"
                        >
                            Update Schedule
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
