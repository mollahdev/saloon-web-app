'use client';
import {
    Button,
    Modal,
    TextInput,
    Switch,
    Select,
    SegmentedControl,
    Stack,
    Text,
    Group,
    Divider,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useState, useCallback, useMemo } from 'react';
import { TbRepeat, TbCalendarEvent } from 'react-icons/tb';
import { TimeOffFormValues, timeOffSchema } from '@/app/lib/validation/time-off';
import { REPEAT_OPTIONS, DAY_OF_WEEK_OPTIONS } from '@/constants';
import dayjs from 'dayjs';
import { TimeOffData } from './time-off-section';
import ScheduleDatePicker from './schedule-date-picker';
import ScheduleTimePicker from './schedule-time-picker';

const typeConfig: Record<
    string,
    { label: string; icon: React.ReactNode; color: string; description: string }
> = {
    SINGLE: {
        label: 'One-time',
        icon: <TbCalendarEvent size={16} />,
        color: 'blue',
        description: 'Single day or date range',
    },
    RECURRING: {
        label: 'Recurring',
        icon: <TbRepeat size={16} />,
        color: 'violet',
        description: 'Repeats weekly or monthly or yearly',
    },
};

function getOrdinalSuffix(n: number): string {
    if (n >= 11 && n <= 13) return 'th';
    switch (n % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

const MONTH_OPTIONS = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

/** Returns the number of days in a given month (non-leap year for recurring) */
function getDaysInMonth(month: number): number {
    // Use a non-leap year (2025) as the base for recurring schedules
    return new Date(2025, month, 0).getDate();
}

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

interface TimeOffModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (entry: TimeOffData) => void;
    editingEntry?: TimeOffData | null;
}

function getInitialType(entry?: TimeOffData | null): 'SINGLE' | 'RECURRING' {
    return (entry?.type as 'SINGLE' | 'RECURRING') || 'SINGLE';
}

function getInitialFormValues(entry?: TimeOffData | null): TimeOffFormValues {
    if (entry) {
        return {
            type: (entry.type as any) || 'SINGLE',
            title: entry.title || '',
            isFullDay: entry.isFullDay ?? true,
            startDate: entry.startDate || '',
            endDate: entry.endDate || null,
            startTime: entry.startTime || null,
            endTime: entry.endTime || null,
            repeatType: (entry.repeatType as any) || null,
            repeatDay: entry.repeatDay || null,
            repeatMonth: entry.repeatMonth || null,
        };
    }
    return {
        type: 'SINGLE',
        title: '',
        isFullDay: true,
        startDate: '',
        endDate: null,
        startTime: null,
        endTime: null,
        repeatType: null,
        repeatDay: null,
        repeatMonth: null,
    };
}

/** Shared full-day toggle + time pickers used by both SINGLE and RECURRING */
function FullDayAndTimePickers({ form }: { form: ReturnType<typeof useForm<TimeOffFormValues>> }) {
    return (
        <>
            <Switch
                label="Full day"
                checked={form.values.isFullDay}
                onChange={(event) => form.setFieldValue('isFullDay', event.currentTarget.checked)}
                color="teal"
                styles={{
                    track: { cursor: 'pointer' },
                    label: {
                        fontWeight: 600,
                        cursor: 'pointer',
                    },
                }}
            />

            {!form.values.isFullDay && (
                <Group grow>
                    <ScheduleTimePicker
                        label="Start Time"
                        value={form.values.startTime ?? ''}
                        onChange={(value) => {
                            form.setFieldValue('startTime', value);
                            // Clear end time if it's now invalid (same or before start)
                            if (value && form.values.endTime && value >= form.values.endTime) {
                                form.setFieldValue('endTime', null);
                            }
                        }}
                        error={form.errors.startTime}
                        styles={{ label: labelStyles }}
                    />
                    <ScheduleTimePicker
                        label="End Time"
                        value={form.values.endTime ?? ''}
                        onChange={(value) => {
                            // Only accept if end time is strictly after start time
                            if (value && form.values.startTime && value <= form.values.startTime) {
                                form.setFieldError('endTime', 'End time must be after start time');
                                return;
                            }
                            form.clearFieldError('endTime');
                            form.setFieldValue('endTime', value);
                        }}
                        error={form.errors.endTime}
                        disabled={!form.values.startTime}
                        styles={{ label: labelStyles }}
                    />
                </Group>
            )}
        </>
    );
}

export default function TimeOffModal({
    opened,
    onClose,
    onSubmit,
    editingEntry,
}: TimeOffModalProps) {
    const [selectedType, setSelectedType] = useState<'SINGLE' | 'RECURRING'>(() =>
        getInitialType(editingEntry)
    );

    const form = useForm<TimeOffFormValues>({
        initialValues: getInitialFormValues(editingEntry),
        validate: schemaResolver(timeOffSchema),
    });

    // Reset form state when modal opens — called via onEnter transition callback
    const handleModalOpen = useCallback(() => {
        setSelectedType(getInitialType(editingEntry));
        form.setValues(getInitialFormValues(editingEntry));
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingEntry]);

    const handleTypeChange = (value: string) => {
        const type = value as 'SINGLE' | 'RECURRING';
        setSelectedType(type);
        form.clearErrors();

        if (type === 'RECURRING') {
            form.setValues({
                type,
                title: form.values.title,
                isFullDay: true,
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: null,
                startTime: null,
                endTime: null,
                repeatType: null,
                repeatDay: null,
                repeatMonth: null,
            });
        } else {
            form.setValues({
                type,
                title: form.values.title,
                isFullDay: true,
                startDate: '',
                endDate: null,
                startTime: null,
                endTime: null,
                repeatType: null,
                repeatDay: null,
                repeatMonth: null,
            });
        }
    };

    const handleRepeatTypeChange = (value: string | null) => {
        form.setFieldValue('repeatType', value as any);
        form.setFieldValue('repeatDay', null);
        form.setFieldValue('repeatMonth', null);
        form.setFieldValue('isFullDay', true);
        form.setFieldValue('startTime', null);
        form.setFieldValue('endTime', null);
    };

    // Dynamic day-of-month options based on selected month for MONTHLY
    const monthlyDayOptions = useMemo(() => {
        const days = Array.from({ length: 31 }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1}${getOrdinalSuffix(i + 1)}`,
        }));
        days.push({ value: '-1', label: 'Last day of the month' });
        return days;
    }, []);

    // Dynamic day-of-month options for YEARLY based on selected month
    const yearlyDayOptions = useMemo(() => {
        const month = form.values.repeatMonth;
        const maxDays = month ? getDaysInMonth(month) : 31;
        return Array.from({ length: maxDays }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1}${getOrdinalSuffix(i + 1)}`,
        }));
    }, [form.values.repeatMonth]);

    const handleFormSubmit = (values: TimeOffFormValues) => {
        const entry: TimeOffData = {
            ...values,
            id: editingEntry?.id || crypto.randomUUID(),
        };
        onSubmit(entry);
        onClose();
        form.reset();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            transitionProps={{ onEnter: handleModalOpen }}
            title={
                <Text fw={700} size="lg">
                    {editingEntry ? 'Edit Time Off' : 'Add Time Off'}
                </Text>
            }
            size="md"
            radius="lg"
            centered
        >
            <form onSubmit={form.onSubmit(handleFormSubmit)} noValidate>
                <Stack gap="md">
                    {/* Type selector */}
                    <div>
                        <Text size="xs" fw={700} className="uppercase text-gray-400 mb-2">
                            Type
                        </Text>
                        <SegmentedControl
                            fullWidth
                            value={selectedType}
                            onChange={handleTypeChange}
                            disabled={!!editingEntry}
                            data={[
                                {
                                    value: 'SINGLE',
                                    label: (
                                        <div className="flex items-center gap-1.5 justify-center py-0.5">
                                            <TbCalendarEvent size={15} />
                                            <span className="text-xs font-semibold">One-time</span>
                                        </div>
                                    ),
                                },
                                {
                                    value: 'RECURRING',
                                    label: (
                                        <div className="flex items-center gap-1.5 justify-center py-0.5">
                                            <TbRepeat size={15} />
                                            <span className="text-xs font-semibold">Recurring</span>
                                        </div>
                                    ),
                                },
                            ]}
                            styles={{
                                root: { backgroundColor: 'var(--mantine-color-gray-0)' },
                            }}
                        />
                        <Text size="xs" c="dimmed" className="mt-1.5">
                            {typeConfig[selectedType].description}
                        </Text>
                    </div>

                    <Divider />

                    {/* Title */}
                    <TextInput
                        label="Title"
                        placeholder="e.g., Vacation, Lunch break, Doctor visit"
                        {...form.getInputProps('title')}
                        styles={{ label: labelStyles }}
                    />

                    {/* ===== SINGLE (One-time) layout ===== */}
                    {selectedType === 'SINGLE' && (
                        <>
                            {/* Date selection */}
                            <Group grow>
                                <ScheduleDatePicker
                                    label="Start Date"
                                    placeholder="Pick date"
                                    value={
                                        form.values.startDate
                                            ? new Date(form.values.startDate)
                                            : null
                                    }
                                    onChange={(date) =>
                                        form.setFieldValue(
                                            'startDate',
                                            date ? dayjs(date).format('YYYY-MM-DD') : ''
                                        )
                                    }
                                    error={form.errors.startDate}
                                    minDate={new Date()}
                                    styles={{ label: labelStyles }}
                                />

                                <ScheduleDatePicker
                                    label="End Date"
                                    placeholder={
                                        form.values.startDate
                                            ? 'Optional'
                                            : 'Select start date first'
                                    }
                                    value={
                                        form.values.endDate ? new Date(form.values.endDate) : null
                                    }
                                    onChange={(date) =>
                                        form.setFieldValue(
                                            'endDate',
                                            date ? dayjs(date).format('YYYY-MM-DD') : null
                                        )
                                    }
                                    error={form.errors.endDate}
                                    minDate={
                                        form.values.startDate
                                            ? new Date(form.values.startDate)
                                            : new Date()
                                    }
                                    disabled={!form.values.startDate}
                                    clearable
                                    styles={{ label: labelStyles }}
                                />
                            </Group>

                            <FullDayAndTimePickers form={form} />
                        </>
                    )}

                    {/* ===== RECURRING layout ===== */}
                    {selectedType === 'RECURRING' && (
                        <>
                            {/* Repeat frequency selector */}
                            <Select
                                label="Repeat Every"
                                placeholder="Select frequency"
                                data={REPEAT_OPTIONS}
                                value={form.values.repeatType || ''}
                                onChange={handleRepeatTypeChange}
                                error={form.errors.repeatType}
                                styles={{ label: labelStyles }}
                            />

                            {/* --- DAILY: full day toggle + time --- */}
                            {form.values.repeatType === 'DAILY' && (
                                <FullDayAndTimePickers form={form} />
                            )}

                            {/* --- WEEKLY: day of week → full day toggle + time --- */}
                            {form.values.repeatType === 'WEEKLY' && (
                                <>
                                    <Select
                                        label="Day of Week"
                                        placeholder="Select day"
                                        data={DAY_OF_WEEK_OPTIONS}
                                        value={
                                            form.values.repeatDay !== null
                                                ? String(form.values.repeatDay)
                                                : ''
                                        }
                                        onChange={(value) =>
                                            form.setFieldValue('repeatDay', value as any)
                                        }
                                        styles={{ label: labelStyles }}
                                    />
                                    <FullDayAndTimePickers form={form} />
                                </>
                            )}

                            {/* --- MONTHLY: day of month → full day toggle + time --- */}
                            {form.values.repeatType === 'MONTHLY' && (
                                <>
                                    <Select
                                        label="Day of Month"
                                        placeholder="Select day"
                                        data={monthlyDayOptions}
                                        value={
                                            form.values.repeatDay !== null
                                                ? String(form.values.repeatDay)
                                                : ''
                                        }
                                        onChange={(value) =>
                                            form.setFieldValue(
                                                'repeatDay',
                                                value !== null ? parseInt(value) : null
                                            )
                                        }
                                        error={form.errors.repeatDay}
                                        styles={{ label: labelStyles }}
                                    />
                                    {form.values.repeatDay != null &&
                                        form.values.repeatDay >= 29 &&
                                        form.values.repeatDay !== -1 && (
                                            <Text size="xs" c="orange" className="-mt-2">
                                                This day doesn&apos;t exist in every month — it will
                                                be skipped in shorter months.
                                            </Text>
                                        )}
                                    <FullDayAndTimePickers form={form} />
                                </>
                            )}

                            {/* --- YEARLY: month → day of month (dynamic) → full day + time --- */}
                            {form.values.repeatType === 'YEARLY' && (
                                <>
                                    <Group grow>
                                        <Select
                                            label="Month"
                                            placeholder="Select month"
                                            data={MONTH_OPTIONS}
                                            value={
                                                form.values.repeatMonth !== null &&
                                                form.values.repeatMonth !== undefined
                                                    ? String(form.values.repeatMonth)
                                                    : ''
                                            }
                                            onChange={(value) => {
                                                const month =
                                                    value !== null ? parseInt(value) : null;
                                                form.setFieldValue('repeatMonth', month);
                                                // Reset day if it exceeds the new month's max
                                                if (
                                                    month &&
                                                    form.values.repeatDay &&
                                                    form.values.repeatDay > getDaysInMonth(month)
                                                ) {
                                                    form.setFieldValue('repeatDay', null);
                                                }
                                            }}
                                            error={form.errors.repeatMonth}
                                            styles={{ label: labelStyles }}
                                        />
                                        <Select
                                            label="Day"
                                            placeholder={
                                                form.values.repeatMonth
                                                    ? 'Select day'
                                                    : 'Select month first'
                                            }
                                            data={yearlyDayOptions}
                                            value={
                                                form.values.repeatDay !== null
                                                    ? String(form.values.repeatDay)
                                                    : ''
                                            }
                                            onChange={(value) =>
                                                form.setFieldValue(
                                                    'repeatDay',
                                                    value !== null ? parseInt(value) : null
                                                )
                                            }
                                            disabled={!form.values.repeatMonth}
                                            error={form.errors.repeatDay}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Group>
                                    <FullDayAndTimePickers form={form} />
                                </>
                            )}
                        </>
                    )}

                    <Divider />

                    {/* Submit */}
                    <Group justify="flex-end">
                        <Button variant="default" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingEntry ? 'Update Time Off' : 'Add Time Off'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
