import { z } from 'zod';

export const profileSchema = z.object({
    avatar: z.string().optional(),
    name: z.string(),
    position: z.string(),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    role: z.enum(['owner', 'admin', 'member']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    specialties: z
        .array(
            z.object({
                name: z.string(),
                isGood: z.boolean(),
            })
        )
        .optional(),
    workingHours: z.array(
        z.object({
            isActive: z.boolean(),
            isFullDay: z.boolean(),
            startTime: z.string(),
            endTime: z.string(),
            day: z.string(),
        })
    ),
});

export type ProfileValues = z.infer<typeof profileSchema>;
