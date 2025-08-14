import { z } from "zod";

export const RegisterUserSchema = z.object({
    username: z.string().min(3).max(25),
    email: z.email().min(3),
    password: z.string().min(6),
});
export type RegisterUserData = z.infer<typeof RegisterUserSchema>;


export const LoginUserSchema = z.object({
    email: z.email().min(3),
    password: z.string().min(6),
});
export type LoginUserData = z.infer<typeof LoginUserSchema>;
