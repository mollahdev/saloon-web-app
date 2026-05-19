import { z } from 'zod';
import { TimeOffFormValues } from './time-off';

export const scheduleSchema = z.object({
    id: z.string().optional(),
    dayOfWeek: z.enum([
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
    ]),
    isOffDay: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});

export const ScheduleSchema = z.object({
    schedule: z.array(scheduleSchema),
});

export type ScheduleValues = z.infer<typeof ScheduleSchema>;
export type ScheduleValue = z.infer<typeof scheduleSchema>;
export type TimeOffValue = TimeOffFormValues & { id?: string };
