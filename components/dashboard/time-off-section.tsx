'use client';
import { Button, Stack, Text, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineCalendar, HiOutlinePencil } from 'react-icons/hi';
import { TbRepeat, TbCoffee, TbCalendarEvent } from 'react-icons/tb';
import { useConfirmation } from '@/hooks/use-confirmation';
import { DAY_OF_WEEK_OPTIONS } from '@/constants';
import dayjs from 'dayjs';
import TimeOffModal from './time-off-modal';

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
            const start12 = dayjs(`1970-01-01T${entry.startTime.substring(0, 5)}`).format('h:mm A');
            const end12 = dayjs(`1970-01-01T${entry.endTime.substring(0, 5)}`).format('h:mm A');
            parts.push(`${start12} – ${end12}`);
        }
    }

    if (entry.type === 'RECURRING' && entry.repeatType) {
        const repeatLabel =
            entry.repeatType === 'WEEKLY' &&
            entry.repeatDay !== null &&
            entry.repeatDay !== undefined
                ? `Every ${DAY_OF_WEEK_OPTIONS.find((d) => d.value === String(entry.repeatDay))?.label || ''}`
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
    const [editingEntry, setEditingEntry] = useState<TimeOffData | null>(null);

    const [timeOffs, setTimeOffs] = useState<TimeOffData[]>(initialValues || []);

    const handleOpenAdd = () => {
        setEditingEntry(null);
        open();
    };

    const handleEdit = (entry: TimeOffData) => {
        setEditingEntry(entry);
        open();
    };

    const handleModalSubmit = (entry: TimeOffData) => {
        if (editingEntry?.id) {
            setTimeOffs(timeOffs.map((t) => (t.id === editingEntry.id ? entry : t)));
            onUpdate?.(editingEntry.id, entry);
            toast.success('Time off updated successfully');
        } else {
            setTimeOffs([...timeOffs, entry]);
            onAdd?.(entry);
            toast.success('Time off added successfully');
        }
        setEditingEntry(null);
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
                    onClick={handleOpenAdd}
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
                            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
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
                            <div className="flex items-center gap-1">
                                <Tooltip label="Edit" withArrow>
                                    <ActionIcon
                                        variant="light"
                                        color="gray"
                                        size="md"
                                        radius="md"
                                        onClick={() => handleEdit(entry)}
                                    >
                                        <HiOutlinePencil size={15} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                        variant="light"
                                        color="red"
                                        size="md"
                                        radius="md"
                                        onClick={() => handleDelete(entry)}
                                    >
                                        <HiOutlineTrash size={15} />
                                    </ActionIcon>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </Stack>
            )}

            {/* Time Off Modal */}
            <TimeOffModal
                opened={opened}
                onClose={close}
                onSubmit={handleModalSubmit}
                editingEntry={editingEntry}
            />
        </div>
    );
}
