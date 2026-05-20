'use client';

import { Button, Divider, Switch, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import { ScheduleSchema, ScheduleValues } from '@/app/lib/validation/schedule';
import ScheduleTimePicker from '@/components/dashboard/schedule-time-picker';

interface ScheduleFormProps {
    initialValues: ScheduleValues['schedule'];
    onSubmit: (values: ScheduleValues) => Promise<void>;
    isLoading: boolean;
    submitLabel: string;
}

const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
};

export function ScheduleForm({
    initialValues,
    onSubmit,
    isLoading,
    submitLabel,
}: ScheduleFormProps) {
    const form = useForm<ScheduleValues>({
        initialValues: {
            schedule: initialValues,
        },
        validate: schemaResolver(ScheduleSchema),
    });

    useEffect(() => {
        if (initialValues && initialValues.length > 0) {
            form.setValues({ schedule: initialValues });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    return (
        <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form onSubmit={form.onSubmit(onSubmit)} noValidate>
                <Stack gap={0}>
                    {form.values.schedule.map((item, index) => (
                        <div key={item.dayOfWeek} className="transition-colors hover:bg-gray-50/50">
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
                                    <ScheduleTimePicker
                                        label="Opening"
                                        size="sm"
                                        disabled={item.isOffDay}
                                        className="w-[48%] sm:w-36"
                                        value={form.values.schedule[index].startTime ?? ''}
                                        onChange={(value) =>
                                            form.setFieldValue(`schedule.${index}.startTime`, value)
                                        }
                                        error={form.errors[`schedule.${index}.startTime`]}
                                        styles={labelStyles}
                                    />
                                    <ScheduleTimePicker
                                        label="Closing"
                                        size="sm"
                                        disabled={item.isOffDay}
                                        className="w-[48%] sm:w-36"
                                        value={form.values.schedule[index].endTime ?? ''}
                                        onChange={(value) =>
                                            form.setFieldValue(`schedule.${index}.endTime`, value)
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
                    ))}
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
