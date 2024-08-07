import z from 'zod';
import {UserRole} from "@prisma/client";

export const ZodSettingsSchema = z.object({
    name: z.string()
        .min(3, {message: "minimum 3 character"})
        .max(50, {message: "maximum 50 character"}).optional(),
    email: z.string().email({message: "invalid email"}).optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    password: z.string()
        .min(6, {message: "minimum 6 character"})
        .max(50, {message: "maximum 50 character"}).optional(),
    confirmPassword: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
})