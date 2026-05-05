import { z } from 'zod';

export const timeOffTypeEnum = z.enum(['SINGLE', 'BREAK', 'RECURRING']);
export const repeatTypeEnum = z.enum(['DAILY', 'WEEKLY', 'MONTHLY']);

export const timeOffSchema = z
    .object({
        type: timeOffTypeEnum,
        title: z.string().min(1, 'Title is required').max(255),
        isFullDay: z.boolean(),
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().nullable().optional(),
        startTime: z.string().nullable().optional(),
        endTime: z.string().nullable().optional(),
        repeatType: repeatTypeEnum.nullable().optional(),
        repeatDay: z.number().int().nullable().optional(),
    })
    .refine(
        (data) => {
            if (!data.isFullDay) {
                return !!data.startTime && !!data.endTime;
            }
            return true;
        },
        {
            message: 'Start time and end time are required for time-range entries',
            path: ['startTime'],
        }
    )
    .refine(
        (data) => {
            if (data.type === 'SINGLE' && data.endDate) {
                return new Date(data.endDate) >= new Date(data.startDate);
            }
            return true;
        },
        {
            message: 'End date must be after start date',
            path: ['endDate'],
        }
    )
    .refine(
        (data) => {
            if (data.type === 'RECURRING') {
                return !!data.repeatType;
            }
            return true;
        },
        {
            message: 'Repeat type is required for recurring time off',
            path: ['repeatType'],
        }
    );

export type TimeOffFormValues = z.infer<typeof timeOffSchema>;
