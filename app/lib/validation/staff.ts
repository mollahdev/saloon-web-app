import { z } from 'zod';

export const createStaffSchema = z.object({
    name: z.string('Name is required').min(2, 'Name must be at least 2 characters long'),
    email: z.string('Email is required').email('Please enter a valid email address'),
    position: z
        .string()
        .min(3, 'Position must be at least 3 characters long')
        .default('Barber/Stylist'),
    bio: z.string().optional().nullable(),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
});

export type CreateStaffValues = z.infer<typeof createStaffSchema>;
