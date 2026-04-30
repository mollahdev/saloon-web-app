import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
    email: z.email('Please enter a valid email address'),
    currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

export const forgetPasswordSchema = z.object({
    email: z.email('Please enter a valid email address'),
});

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
    code: z.string().min(6, 'Code must be at least 6 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
