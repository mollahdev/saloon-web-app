import { z } from 'zod';

export const profileSchema = z.object({
    avatar: z.string().optional(),
    name: z.string(),
    position: z.string(),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).default('MEMBER'),
    status: z
        .enum(['ACTIVE', 'LOCKED', 'INACTIVE', 'PENDING_VERIFICATION'])
        .default('PENDING_VERIFICATION'),
});

export type ProfileValues = z.infer<typeof profileSchema>;
