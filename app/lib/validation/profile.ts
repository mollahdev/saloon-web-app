import { z } from 'zod';

export const profileSchema = z.object({
    avatar: z.string().optional(),
    name: z.string('Name is required').min(2, 'Name must be at least 2 characters long'),
    position: z
        .string('Position is required')
        .min(3, 'Position must be at least 3 characters long'),
    phone: z.string('Phone number is required').optional(),
    address: z.string().optional(),
    role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).default('MEMBER'),
    bio: z.string('Bio is required').optional(),
    status: z
        .enum(['ACTIVE', 'LOCKED', 'INACTIVE', 'PENDING_VERIFICATION'])
        .default('PENDING_VERIFICATION'),
});

export type ProfileValues = z.infer<typeof profileSchema>;
