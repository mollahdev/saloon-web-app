import { z } from 'zod';

export const timeOffTypeEnum = z.enum(['SINGLE', 'RECURRING']);
export const repeatTypeEnum = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']);

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
        repeatDay: z.number().int().min(-1).nullable().optional(),
        repeatMonth: z.number().int().min(1).max(12).nullable().optional(),
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
    )
    .refine(
        (data) => {
            if (
                data.type === 'RECURRING' &&
                (data.repeatType === 'WEEKLY' ||
                    data.repeatType === 'MONTHLY' ||
                    data.repeatType === 'YEARLY')
            ) {
                return data.repeatDay !== null && data.repeatDay !== undefined;
            }
            return true;
        },
        {
            message: 'Day selection is required',
            path: ['repeatDay'],
        }
    )
    .refine(
        (data) => {
            if (data.type === 'RECURRING' && data.repeatType === 'YEARLY') {
                return data.repeatMonth !== null && data.repeatMonth !== undefined;
            }
            return true;
        },
        {
            message: 'Month is required for yearly recurrence',
            path: ['repeatMonth'],
        }
    );

export type TimeOffFormValues = z.infer<typeof timeOffSchema>;
