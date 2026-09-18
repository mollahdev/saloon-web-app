import { z } from 'zod';

export const serviceSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(255),
    description: z.string().max(1000).optional().nullable().or(z.literal('')),
    price: z
        .number({ message: 'Price is required' })
        .int('Price must be a whole number')
        .positive('Price must be greater than 0')
        .max(100000, 'Price cannot exceed $100,000'),
    duration: z
        .number({ message: 'Duration is required' })
        .int('Duration must be a whole number')
        .positive('Please select a service duration')
        .max(1440, 'Duration cannot exceed 24 hours (1440 minutes)'),
    image: z.string().url('Invalid image URL').optional().nullable().or(z.literal('')),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
    enableCoupons: z.boolean().optional().default(false),
    coupons: z
        .array(
            z.object({
                couponId: z.string().uuid('Invalid coupon ID'),
                amount: z
                    .number({ message: 'Amount is required' })
                    .positive('Amount must be greater than 0'),
            })
        )
        .refine((items) => new Set(items.map((i) => i.couponId)).size === items.length, {
            message: 'Coupons must be unique',
        })
        .optional()
        .default([]),
    pricingVariations: z
        .array(
            z.object({
                staffId: z.string().uuid('Invalid staff ID'),
                price: z
                    .number({ message: 'Price is required' })
                    .positive('Price must be greater than 0')
                    .max(100000, 'Price cannot exceed $100,000'),
                enableCoupons: z.boolean().optional().default(false),
                coupons: z
                    .array(
                        z.object({
                            couponId: z.string().uuid('Invalid coupon ID'),
                            amount: z
                                .number({ message: 'Amount is required' })
                                .positive('Amount must be greater than 0'),
                        })
                    )
                    .refine(
                        (items) => new Set(items.map((i) => i.couponId)).size === items.length,
                        { message: 'Coupons must be unique' }
                    )
                    .optional()
                    .default([]),
            })
        )
        .refine((items) => new Set(items.map((i) => i.staffId)).size === items.length, {
            message: 'Each staff member can only have one pricing variation',
        })
        .optional()
        .default([]),
});

export type ServiceValues = z.infer<typeof serviceSchema>;
