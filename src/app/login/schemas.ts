// schemas.ts
import { z } from 'zod';

export const emailSchema = z.string().email();
export const usernameSchema = z.string().min(3).max(25);
export const passwordSchema = z.string().min(8).max(80).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,80}$/);


// Custom Zod schema for login data with email or username
export const loginSchema = z.object({
    emailOrUsername: z.union([emailSchema, usernameSchema]),
    password: passwordSchema,
});