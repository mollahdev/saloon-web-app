import { z } from 'zod';
import { CouponDiscountType, CouponStatus } from '@/models/coupon';

export const couponSchema = z
    .object({
        code: z
            .string()
            .min(3, 'Code must be at least 3 characters')
            .max(50, 'Code must be at most 50 characters')
            .regex(
                /^[A-Za-z0-9_-]+$/,
                'Code can only contain letters, numbers, hyphens, and underscores'
            ),
        description: z.string().max(1000).optional().nullable().or(z.literal('')),
        discountType: z.nativeEnum(CouponDiscountType),
        amount: z
            .number({ message: 'Amount is required' })
            .positive('Amount must be greater than 0'),
        expiryDate: z.string().optional().nullable().or(z.literal('')),
        usageLimit: z.number().int().positive().optional().nullable(),
        minimumSpend: z.number().nonnegative().optional().nullable(),
        maximumSpend: z.number().nonnegative().optional().nullable(),
        services: z.array(z.string()).optional(),
        excludeServices: z.array(z.string()).optional(),
        staffs: z.array(z.string()).optional(),
        excludeStaffs: z.array(z.string()).optional(),
        status: z.nativeEnum(CouponStatus).default(CouponStatus.ACTIVE),
    })
    .refine(
        (data) => {
            if (data.services && data.excludeServices) {
                return !data.services.some((id) => data.excludeServices?.includes(id));
            }
            return true;
        },
        {
            message: 'A service cannot be both applied and excluded',
            path: ['excludeServices'],
        }
    )
    .refine(
        (data) => {
            if (data.staffs && data.excludeStaffs) {
                return !data.staffs.some((id) => data.excludeStaffs?.includes(id));
            }
            return true;
        },
        {
            message: 'A staff member cannot be both applied and excluded',
            path: ['excludeStaffs'],
        }
    );

export type CouponValues = z.infer<typeof couponSchema>;
