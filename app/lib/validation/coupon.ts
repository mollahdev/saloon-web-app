import { z } from 'zod';
import { CouponDiscountType, CouponStatus } from '@/models/coupon';

export const couponSchema = z.object({
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
    usageLimit: z.number().int().positive().optional().nullable(),
    minimumSpend: z.number().nonnegative().optional().nullable(),
    status: z.nativeEnum(CouponStatus).default(CouponStatus.ACTIVE),
});

export type CouponValues = z.infer<typeof couponSchema>;
