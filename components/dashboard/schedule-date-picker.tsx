'use client';

import { useCallback, useMemo } from 'react';
import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import { useGetScheduleQuery } from '@/app/lib/store/schedule/api';
import dayjs from 'dayjs';

/**
 * A DatePickerInput that automatically disables days the business is closed.
 * Reads the business schedule via RTK Query (cached globally) and:
 * - Prevents selection of off-days via `excludeDate`
 * - Highlights off-day cells in red via `getDayProps`
 *
 * Accepts all standard DatePickerInput props — any consumer-supplied
 * `excludeDate` or `getDayProps` are merged with the schedule logic.
 */
interface ScheduleDatePickerProps extends DatePickerInputProps {
    /**
     * Additional JS weekday indices (0=Sun … 6=Sat) to disable in the calendar.
     * Use this to disable a staff member's personal off-days on top of the
     * business schedule off-days that are already fetched internally.
     */
    excludeDayOfWeek?: Set<number>;
}

export default function ScheduleDatePicker(props: ScheduleDatePickerProps) {
    const {
        excludeDate: externalExclude,
        getDayProps: externalGetDayProps,
        excludeDayOfWeek,
        ...rest
    } = props;

    const { data: scheduleRes } = useGetScheduleQuery();
    // Map day names to JS Date.getDay() values (0=Sun, 1=Mon, ..., 6=Sat)
    const JS_DAY_MAP: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };

    // Compute which JS day-of-week indices are off-days
    const offDayIndices = useMemo(() => {
        const schedule = scheduleRes?.data?.schedule;
        if (!schedule) return new Set<number>();
        const indices = new Set<number>();
        for (const entry of schedule) {
            if (entry.isOffDay) {
                const idx = JS_DAY_MAP[entry.dayOfWeek];
                if (idx !== undefined) indices.add(idx);
            }
        }
        return indices;
    }, [scheduleRes]);

    const isOffDay = useCallback(
        (date: string) => {
            const dayIndex = dayjs(date).day();
            return offDayIndices.has(dayIndex) || (excludeDayOfWeek?.has(dayIndex) ?? false);
        },
        [offDayIndices, excludeDayOfWeek]
    );

    // Merge with any external excludeDate the consumer passes
    const excludeDate = useCallback(
        (date: string) => isOffDay(date) || (externalExclude ? externalExclude(date) : false),
        [isOffDay, externalExclude]
    );

    // Merge with any external getDayProps the consumer passes
    const getDayProps = useCallback(
        (date: string) => {
            const externalProps = externalGetDayProps?.(date) || {};
            if (isOffDay(date)) {
                return {
                    ...externalProps,
                    style: {
                        color: 'var(--mantine-color-red-4)',
                        backgroundColor: 'var(--mantine-color-red-0)',
                        cursor: 'not-allowed',
                        ...(externalProps as any).style,
                    },
                };
            }
            return externalProps;
        },
        [isOffDay, externalGetDayProps]
    );

    return (
        <DatePickerInput
            {...rest}
            firstDayOfWeek={1}
            weekendDays={[]}
            excludeDate={excludeDate}
            getDayProps={getDayProps}
        />
    );
}
