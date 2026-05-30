'use client';

import { Button, Divider, Switch, Stack, Text, Badge } from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import { ScheduleSchema, ScheduleValues } from '@/app/lib/validation/schedule';
import ScheduleTimePicker from '@/components/dashboard/schedule-time-picker';

interface ScheduleFormProps {
    initialValues: ScheduleValues['schedule'];
    onSubmit: (values: ScheduleValues) => Promise<void>;
    isLoading: boolean;
    submitLabel: string;
    /** Days that are off in the business schedule — staff cannot override these */
    businessSchedule?: ScheduleValues['schedule'];
}

const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
};

export function ScheduleForm({
    initialValues,
    onSubmit,
    isLoading,
    submitLabel,
    businessSchedule,
}: ScheduleFormProps) {
    const form = useForm<ScheduleValues>({
        initialValues: {
            schedule: initialValues,
        },
        validate: schemaResolver(ScheduleSchema),
    });

    /** Set of day names that are closed in the business schedule */
    const businessClosedDays = new Set(
        businessSchedule?.filter((d) => d.isOffDay).map((d) => d.dayOfWeek) ?? []
    );

    useEffect(() => {
        if (initialValues && initialValues.length > 0) {
            form.setValues({ schedule: initialValues });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    return (
        <div className="bg-white p-2 sm:p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form onSubmit={form.onSubmit(onSubmit)} noValidate>
                <Stack gap={0}>
                    {form.values.schedule.map((item, index) => {
                        const isBusinessClosed = businessClosedDays.has(item.dayOfWeek);
                        // Staff's own off-day setting — never overridden by business schedule
                        const isOffDay = item.isOffDay;

                        return (
                            <div
                                key={item.dayOfWeek}
                                className={`transition-colors ${
                                    isBusinessClosed
                                        ? 'opacity-50 grayscale pointer-events-none select-none'
                                        : 'hover:bg-gray-50/50'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-2 sm:p-3">
                                    <div className="flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-start gap-6 sm:gap-8 flex-1">
                                        <div className="sm:w-32 text-right sm:text-left flex items-center gap-2">
                                            <Text fw={700} size="md" className="tracking-tight">
                                                {formatDayName(item.dayOfWeek)}
                                            </Text>
                                            {isBusinessClosed && (
                                                <Badge
                                                    size="xs"
                                                    variant="light"
                                                    color="gray"
                                                    radius="sm"
                                                    className="hidden sm:inline-flex"
                                                >
                                                    Business closed
                                                </Badge>
                                            )}
                                        </div>
                                        <Switch
                                            label={isOffDay ? 'Closed' : 'Open'}
                                            checked={!isOffDay}
                                            onChange={(event) =>
                                                form.setFieldValue(
                                                    `schedule.${index}.isOffDay`,
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
                                                    color: isOffDay
                                                        ? 'var(--mantine-color-red-6)'
                                                        : 'var(--mantine-color-teal-6)',
                                                    cursor: 'pointer',
                                                    width: 60,
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                                        <ScheduleTimePicker
                                            label="Opening"
                                            size="sm"
                                            disabled={isOffDay}
                                            className="w-[48%] sm:w-36"
                                            value={form.values.schedule[index].startTime ?? ''}
                                            onChange={(value) =>
                                                form.setFieldValue(
                                                    `schedule.${index}.startTime`,
                                                    value
                                                )
                                            }
                                            error={form.errors[`schedule.${index}.startTime`]}
                                            styles={labelStyles}
                                        />
                                        <ScheduleTimePicker
                                            label="Closing"
                                            size="sm"
                                            disabled={isOffDay}
                                            className="w-[48%] sm:w-36"
                                            value={form.values.schedule[index].endTime ?? ''}
                                            onChange={(value) =>
                                                form.setFieldValue(
                                                    `schedule.${index}.endTime`,
                                                    value
                                                )
                                            }
                                            error={form.errors[`schedule.${index}.endTime`]}
                                            styles={labelStyles}
                                        />
                                    </div>
                                </div>
                                {index < form.values.schedule.length - 1 && (
                                    <Divider variant="dashed" color="gray.2" />
                                )}
                            </div>
                        );
                    })}
                </Stack>

                <Divider my="md" />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        size="md"
                        loading={isLoading}
                        loaderProps={{ type: 'dots' }}
                        className="w-full sm:w-auto"
                        radius="md"
                    >
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
}

const labelStyles = {
    label: {
        marginBottom: 4,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        color: 'var(--mantine-color-gray-5)',
    },
};
