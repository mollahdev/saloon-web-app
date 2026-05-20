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
import { useState, useCallback } from 'react';
import { TbRepeat, TbCoffee, TbCalendarEvent } from 'react-icons/tb';
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
    BREAK: {
        label: 'Break',
        icon: <TbCoffee size={16} />,
        color: 'orange',
        description: 'Time range within a day',
    },
    RECURRING: {
        label: 'Recurring',
        icon: <TbRepeat size={16} />,
        color: 'violet',
        description: 'Repeats weekly or monthly',
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

function getInitialType(entry?: TimeOffData | null): 'SINGLE' | 'BREAK' | 'RECURRING' {
    return (entry?.type as 'SINGLE' | 'BREAK' | 'RECURRING') || 'SINGLE';
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
    };
}

export default function TimeOffModal({
    opened,
    onClose,
    onSubmit,
    editingEntry,
}: TimeOffModalProps) {
    const [selectedType, setSelectedType] = useState<'SINGLE' | 'BREAK' | 'RECURRING'>(() =>
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
        const type = value as 'SINGLE' | 'BREAK' | 'RECURRING';
        setSelectedType(type);
        form.setFieldValue('type', type);

        // Adjust defaults based on type
        if (type === 'BREAK') {
            form.setFieldValue('isFullDay', false);
            form.setFieldValue('endDate', null);
        } else if (type === 'RECURRING') {
            form.setFieldValue('endDate', null);
        } else {
            form.setFieldValue('isFullDay', true);
            form.setFieldValue('repeatType', null);
            form.setFieldValue('repeatDay', null);
        }
    };

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
                                    value: 'BREAK',
                                    label: (
                                        <div className="flex items-center gap-1.5 justify-center py-0.5">
                                            <TbCoffee size={15} />
                                            <span className="text-xs font-semibold">Break</span>
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

                    {/* Full day toggle — hidden for BREAK type */}
                    {selectedType !== 'BREAK' && (
                        <Switch
                            label="Full day"
                            checked={form.values.isFullDay}
                            onChange={(event) =>
                                form.setFieldValue('isFullDay', event.currentTarget.checked)
                            }
                            color="teal"
                            styles={{
                                track: { cursor: 'pointer' },
                                label: {
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                },
                            }}
                        />
                    )}

                    {/* Date selection */}
                    <Group grow>
                        <ScheduleDatePicker
                            label="Start Date"
                            placeholder="Pick date"
                            value={form.values.startDate ? new Date(form.values.startDate) : null}
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

                        {/* End date — only for SINGLE type with multi-day support */}
                        {selectedType === 'SINGLE' && (
                            <ScheduleDatePicker
                                label="End Date"
                                placeholder="Optional"
                                value={form.values.endDate ? new Date(form.values.endDate) : null}
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
                                clearable
                                styles={{ label: labelStyles }}
                            />
                        )}
                    </Group>

                    {/* Time range — shown when not full day or BREAK type */}
                    {(!form.values.isFullDay || selectedType === 'BREAK') && (
                        <Group grow>
                            <ScheduleTimePicker
                                label="Start Time"
                                value={form.values.startTime ?? ''}
                                onChange={(value) => form.setFieldValue('startTime', value)}
                                error={form.errors.startTime}
                                styles={{ label: labelStyles }}
                            />
                            <ScheduleTimePicker
                                label="End Time"
                                value={form.values.endTime ?? ''}
                                onChange={(value) => form.setFieldValue('endTime', value)}
                                error={form.errors.endTime}
                                styles={{ label: labelStyles }}
                            />
                        </Group>
                    )}

                    {/* Recurring options */}
                    {selectedType === 'RECURRING' && (
                        <>
                            <Select
                                label="Repeat Every"
                                placeholder="Select frequency"
                                data={REPEAT_OPTIONS}
                                value={form.values.repeatType || ''}
                                onChange={(value) => {
                                    form.setFieldValue('repeatType', value as any);
                                    form.setFieldValue('repeatDay', null);
                                }}
                                error={form.errors.repeatType}
                                styles={{ label: labelStyles }}
                            />

                            {form.values.repeatType === 'WEEKLY' && (
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
                            )}

                            {form.values.repeatType === 'MONTHLY' && (
                                <Select
                                    label="Day of Month"
                                    placeholder="Select day"
                                    data={Array.from({ length: 31 }, (_, i) => ({
                                        value: String(i + 1),
                                        label: `${i + 1}${getOrdinalSuffix(i + 1)}`,
                                    }))}
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
                                    styles={{ label: labelStyles }}
                                />
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
