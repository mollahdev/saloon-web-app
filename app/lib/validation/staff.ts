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

export const updateStaffSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    position: z.string().min(3, 'Position must be at least 3 characters long'),
    bio: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    avatar: z.string().optional().nullable(),
    role: z.enum(['ADMIN', 'MEMBER']),
    status: z.enum(['ACTIVE', 'LOCKED', 'INACTIVE', 'PENDING_VERIFICATION']),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .optional()
        .or(z.literal('')),
});

export type UpdateStaffValues = z.infer<typeof updateStaffSchema>;
