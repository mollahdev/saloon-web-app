import { z } from 'zod';

export const workingHourSchema = z.object({
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
    startTime: z.string(),
    endTime: z.string(),
});

export const workingHoursSchema = z.object({
    workingHours: z.array(workingHourSchema),
});

export type WorkingHoursValues = z.infer<typeof workingHoursSchema>;
export type WorkingHourValue = z.infer<typeof workingHourSchema>;
