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
    Badge,
    ActionIcon,
    Tooltip,
    Group,
    Divider,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { schemaResolver, useForm } from '@mantine/form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineCalendar, HiOutlinePencil } from 'react-icons/hi';
import { TbRepeat, TbCoffee, TbCalendarEvent } from 'react-icons/tb';
import { TimeOffFormValues, timeOffSchema } from '@/app/lib/validation/time-off';
import { useConfirmation } from '@/hooks/use-confirmation';
import dayjs from 'dayjs';

export interface TimeOffData {
    id?: string;
    type: string;
    title?: string;
    isFullDay?: boolean;
    startDate?: string;
    endDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    repeatType?: string | null;
    repeatDay?: number | null;
}

interface TimeOffSectionProps {
    initialValues?: TimeOffData[];
    onAdd?: (entry: TimeOffData) => void;
    onRemove?: (id: string) => void;
    onUpdate?: (id: string, entry: TimeOffData) => void;
}

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

const repeatOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
];

const dayOfWeekOptions = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
];

function formatTimeOffDisplay(entry: TimeOffData): string {
    const parts: string[] = [];

    if (entry.isFullDay) {
        parts.push(dayjs(entry.startDate).format('MMM D, YYYY'));
        if (entry.endDate && entry.endDate !== entry.startDate) {
            parts[0] += ` — ${dayjs(entry.endDate).format('MMM D, YYYY')}`;
        }
        parts.push('Full day');
    } else {
        parts.push(dayjs(entry.startDate).format('MMM D, YYYY'));
        if (entry.startTime && entry.endTime) {
            parts.push(`${entry.startTime.substring(0, 5)} – ${entry.endTime.substring(0, 5)}`);
        }
    }

    if (entry.type === 'RECURRING' && entry.repeatType) {
        const repeatLabel =
            entry.repeatType === 'WEEKLY' &&
            entry.repeatDay !== null &&
            entry.repeatDay !== undefined
                ? `Every ${dayOfWeekOptions[entry.repeatDay]?.label || ''}`
                : entry.repeatType === 'MONTHLY' &&
                    entry.repeatDay !== null &&
                    entry.repeatDay !== undefined
                  ? `Monthly on the ${entry.repeatDay}${getOrdinalSuffix(entry.repeatDay)}`
                  : `Repeats ${entry.repeatType.toLowerCase()}`;
        parts.push(repeatLabel);
    }

    return parts.join(' · ');
}

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

export default function TimeOffSection({
    initialValues,
    onAdd,
    onRemove,
    onUpdate,
}: TimeOffSectionProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const { confirm } = useConfirmation();
    const [selectedType, setSelectedType] = useState<'SINGLE' | 'BREAK' | 'RECURRING'>('SINGLE');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [timeOffs, setTimeOffs] = useState<TimeOffData[]>(initialValues || []);

    const form = useForm<TimeOffFormValues>({
        initialValues: {
            type: 'SINGLE',
            title: '',
            isFullDay: true,
            startDate: '',
            endDate: null,
            startTime: null,
            endTime: null,
            repeatType: null,
            repeatDay: null,
        },
        validate: schemaResolver(timeOffSchema),
    });

    const resetAndOpen = () => {
        setEditingId(null);
        form.reset();
        setSelectedType('SINGLE');
        form.setFieldValue('type', 'SINGLE');
        open();
    };

    const handleEdit = (entry: TimeOffData) => {
        setEditingId(entry.id || null);
        setSelectedType((entry.type as 'SINGLE' | 'BREAK' | 'RECURRING') || 'SINGLE');
        form.setValues({
            type: (entry.type as any) || 'SINGLE',
            title: entry.title || '',
            isFullDay: entry.isFullDay ?? true,
            startDate: entry.startDate || '',
            endDate: entry.endDate || null,
            startTime: entry.startTime || null,
            endTime: entry.endTime || null,
            repeatType: (entry.repeatType as any) || null,
            repeatDay: entry.repeatDay || null,
        });
        open();
    };

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

    const handleSubmit = (values: TimeOffFormValues) => {
        if (editingId) {
            const updatedEntry: TimeOffData = {
                ...values,
                id: editingId,
            };
            setTimeOffs(timeOffs.map((t) => (t.id === editingId ? updatedEntry : t)));
            onUpdate?.(editingId, updatedEntry);
            toast.success('Time off updated successfully');
        } else {
            const newEntry: TimeOffData = {
                ...values,
                id: crypto.randomUUID(), // Temporary ID for local state
            };
            setTimeOffs([...timeOffs, newEntry]);
            onAdd?.(newEntry);
            toast.success('Time off added successfully');
        }
        close();
        form.reset();
        setEditingId(null);
    };

    const handleDelete = (entry: TimeOffData) => {
        confirm({
            title: 'Delete Time Off',
            message: `Are you sure you want to delete "${entry.title}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            color: 'red',
            onConfirm: () => {
                setTimeOffs(timeOffs.filter((t) => t.id !== entry.id));
                if (entry.id) {
                    onRemove?.(entry.id);
                }
                toast.success('Time off deleted successfully');
            },
        });
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HiOutlineCalendar size={20} className="text-gray-500" />
                    <Text fw={700} size="md">
                        Time Off & Vacations
                    </Text>
                </div>
                <Button
                    variant="light"
                    color="teal"
                    size="xs"
                    leftSection={<HiOutlinePlus size={14} />}
                    onClick={resetAndOpen}
                    className="font-semibold"
                >
                    Add
                </Button>
            </div>

            {/* Time off list */}
            {timeOffs.length === 0 ? (
                <div className="py-8 text-center">
                    <HiOutlineCalendar size={32} className="mx-auto text-gray-300 mb-2" />
                    <Text size="sm" c="dimmed">
                        No time off scheduled
                    </Text>
                </div>
            ) : (
                <Stack gap="xs">
                    {timeOffs.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group"
                        >
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div
                                    className="shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                        backgroundColor: `var(--mantine-color-${typeConfig[entry.type].color}-0)`,
                                        color: `var(--mantine-color-${typeConfig[entry.type].color}-6)`,
                                    }}
                                >
                                    {typeConfig[entry.type].icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Text size="sm" fw={600} className="truncate">
                                            {entry.title}
                                        </Text>
                                        <Badge
                                            size="xs"
                                            variant="light"
                                            color={typeConfig[entry.type].color}
                                        >
                                            {typeConfig[entry.type].label}
                                        </Badge>
                                        {entry.isFullDay && (
                                            <Badge size="xs" variant="outline" color="gray">
                                                Full day
                                            </Badge>
                                        )}
                                    </div>
                                    <Text size="xs" c="dimmed" className="mt-0.5">
                                        {formatTimeOffDisplay(entry)}
                                    </Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip label="Edit" withArrow>
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        size="sm"
                                        onClick={() => handleEdit(entry)}
                                    >
                                        <HiOutlinePencil size={14} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={() => handleDelete(entry)}
                                    >
                                        <HiOutlineTrash size={14} />
                                    </ActionIcon>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </Stack>
            )}

            {/* Add Time Off Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Text fw={700} size="lg">
                        {editingId ? 'Edit Time Off' : 'Add Time Off'}
                    </Text>
                }
                size="md"
                radius="lg"
                centered
            >
                <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
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
                                                <span className="text-xs font-semibold">
                                                    One-time
                                                </span>
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
                                                <span className="text-xs font-semibold">
                                                    Recurring
                                                </span>
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
                            styles={{
                                label: {
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: 'var(--mantine-color-gray-5)',
                                    marginBottom: 4,
                                },
                            }}
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
                            <DatePickerInput
                                label="Start Date"
                                placeholder="Pick date"
                                value={
                                    form.values.startDate ? new Date(form.values.startDate) : null
                                }
                                onChange={(date) =>
                                    form.setFieldValue(
                                        'startDate',
                                        date ? dayjs(date).format('YYYY-MM-DD') : ''
                                    )
                                }
                                error={form.errors.startDate}
                                minDate={new Date()}
                                styles={{
                                    label: {
                                        fontSize: 11,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: 'var(--mantine-color-gray-5)',
                                        marginBottom: 4,
                                    },
                                }}
                            />

                            {/* End date — only for SINGLE type with multi-day support */}
                            {selectedType === 'SINGLE' && (
                                <DatePickerInput
                                    label="End Date"
                                    placeholder="Optional"
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
                                    clearable
                                    styles={{
                                        label: {
                                            fontSize: 11,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: 'var(--mantine-color-gray-5)',
                                            marginBottom: 4,
                                        },
                                    }}
                                />
                            )}
                        </Group>

                        {/* Time range — shown when not full day or BREAK type */}
                        {(!form.values.isFullDay || selectedType === 'BREAK') && (
                            <Group grow>
                                <TextInput
                                    type="time"
                                    label="Start Time"
                                    className="time-picker-no-icon"
                                    onClick={(event) => event.currentTarget.showPicker()}
                                    {...form.getInputProps('startTime')}
                                    styles={{
                                        input: { cursor: 'pointer' },
                                        label: {
                                            fontSize: 11,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: 'var(--mantine-color-gray-5)',
                                            marginBottom: 4,
                                        },
                                    }}
                                />
                                <TextInput
                                    type="time"
                                    label="End Time"
                                    className="time-picker-no-icon"
                                    onClick={(event) => event.currentTarget.showPicker()}
                                    {...form.getInputProps('endTime')}
                                    styles={{
                                        input: { cursor: 'pointer' },
                                        label: {
                                            fontSize: 11,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: 'var(--mantine-color-gray-5)',
                                            marginBottom: 4,
                                        },
                                    }}
                                />
                            </Group>
                        )}

                        {/* Recurring options */}
                        {selectedType === 'RECURRING' && (
                            <>
                                <Select
                                    label="Repeat Every"
                                    placeholder="Select frequency"
                                    data={repeatOptions}
                                    value={form.values.repeatType || ''}
                                    onChange={(value) => {
                                        form.setFieldValue('repeatType', value as any);
                                        form.setFieldValue('repeatDay', null);
                                    }}
                                    error={form.errors.repeatType}
                                    styles={{
                                        label: {
                                            fontSize: 11,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: 'var(--mantine-color-gray-5)',
                                            marginBottom: 4,
                                        },
                                    }}
                                />

                                {form.values.repeatType === 'WEEKLY' && (
                                    <Select
                                        label="Day of Week"
                                        placeholder="Select day"
                                        data={dayOfWeekOptions}
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
                                        styles={{
                                            label: {
                                                fontSize: 11,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                color: 'var(--mantine-color-gray-5)',
                                                marginBottom: 4,
                                            },
                                        }}
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
                                        styles={{
                                            label: {
                                                fontSize: 11,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                color: 'var(--mantine-color-gray-5)',
                                                marginBottom: 4,
                                            },
                                        }}
                                    />
                                )}
                            </>
                        )}

                        <Divider />

                        {/* Submit */}
                        <Group justify="flex-end">
                            <Button variant="default" onClick={close}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingId ? 'Update Time Off' : 'Add Time Off'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </div>
    );
}
