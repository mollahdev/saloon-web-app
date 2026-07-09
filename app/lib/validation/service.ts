import { z } from 'zod';

export const serviceSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(255),
    description: z.string().max(1000).optional().nullable().or(z.literal('')),
    price: z.number({ message: 'Price is required' }).positive('Price must be greater than 0'),
    duration: z
        .number({ message: 'Duration is required' })
        .int('Duration must be a whole number')
        .positive('Duration must be greater than 0'),
    image: z.string().url('Invalid image URL').optional().nullable().or(z.literal('')),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export type ServiceValues = z.infer<typeof serviceSchema>;
