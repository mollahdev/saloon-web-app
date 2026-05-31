'use client';
import { Button, Stack, Text, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineCalendar, HiOutlinePencil } from 'react-icons/hi';
import { TbRepeat, TbCalendarEvent } from 'react-icons/tb';
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
    repeatMonth?: number | null;
}

interface TimeOffSectionProps {
    entries: TimeOffData[];
    opened: boolean;
    editingEntry: TimeOffData | null;
    onOpenAdd: () => void;
    onEdit: (entry: TimeOffData) => void;
    onClose: () => void;
    onSubmit: (entry: TimeOffData) => void;
    onDelete: (entry: TimeOffData) => void;
    /**
     * JS weekday indices (0=Sun…6=Sat) to disable in the date picker.
     * Pass the combined set of business + staff off-day indices.
     */
    excludeDayOfWeek?: Set<number>;
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
        let repeatLabel: string;
        if (entry.repeatType === 'DAILY') {
            repeatLabel = 'Every day';
        } else if (
            entry.repeatType === 'WEEKLY' &&
            entry.repeatDay !== null &&
            entry.repeatDay !== undefined
        ) {
            repeatLabel = `Every ${DAY_OF_WEEK_OPTIONS.find((d) => d.value === String(entry.repeatDay))?.label || ''}`;
        } else if (
            entry.repeatType === 'MONTHLY' &&
            entry.repeatDay !== null &&
            entry.repeatDay !== undefined
        ) {
            repeatLabel =
                entry.repeatDay === -1
                    ? 'Monthly on the last day'
                    : `Monthly on the ${entry.repeatDay}${getOrdinalSuffix(entry.repeatDay)}`;
        } else if (
            entry.repeatType === 'YEARLY' &&
            entry.repeatMonth !== null &&
            entry.repeatMonth !== undefined &&
            entry.repeatDay !== null &&
            entry.repeatDay !== undefined
        ) {
            const monthName = dayjs()
                .month(entry.repeatMonth - 1)
                .format('MMMM');
            repeatLabel = `Every ${monthName} ${entry.repeatDay}${getOrdinalSuffix(entry.repeatDay)}`;
        } else {
            repeatLabel = `Repeats ${entry.repeatType.toLowerCase()}`;
        }
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
    entries,
    opened,
    editingEntry,
    onOpenAdd,
    onEdit,
    onClose,
    onSubmit,
    onDelete,
    excludeDayOfWeek,
}: TimeOffSectionProps) {
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
                    onClick={onOpenAdd}
                    className="font-semibold"
                >
                    Add
                </Button>
            </div>

            {/* Time off list */}
            {entries.length === 0 ? (
                <div className="py-8 text-center">
                    <HiOutlineCalendar size={32} className="mx-auto text-gray-300 mb-2" />
                    <Text size="sm" c="dimmed">
                        No time off scheduled
                    </Text>
                </div>
            ) : (
                <Stack gap="xs">
                    {entries.map((entry) => (
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
                                        onClick={() => onEdit(entry)}
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
                                        onClick={() => onDelete(entry)}
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
                onClose={onClose}
                onSubmit={onSubmit}
                editingEntry={editingEntry}
                excludeDayOfWeek={excludeDayOfWeek}
            />
        </div>
    );
}
