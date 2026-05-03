'use client';
import { Button, Divider, TextInput, Switch, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import WorkingHoursLoading from './loading';
import { workingHoursSchema, WorkingHoursValues } from '@/app/lib/validation/working-hours';
import {
    useGetWorkingHoursQuery,
    useUpdateWorkingHoursMutation,
} from '@/app/lib/store/working-hours/api';
import { defaultWorkingHours } from '@/constants';

const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
};

export default function WorkingHoursPage() {
    const { data: response, isLoading, error } = useGetWorkingHoursQuery();
    const [updateWorkingHours, { isLoading: isUpdating }] = useUpdateWorkingHoursMutation();

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

    if (isLoading || error) {
        return <WorkingHoursLoading />;
    }

    const handleSubmit = async (values: WorkingHoursValues) => {
        try {
            const res = await updateWorkingHours(values).unwrap();
            toast.success(res.message || 'Working hours updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update working hours');
        }
    };

    return (
        <>
            <PageTitle.Source>Working Hours</PageTitle.Source>
            <div className="max-w-3xl mx-auto bg-white p-2 md:p-6 rounded-xl shadow-sm border border-gray-100">
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
        </>
    );
}
