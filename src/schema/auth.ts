import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'password must be at least 6 characters long')
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'password must be at least 6 characters long'),
  fullName: z.string().min(2, 'full name must be at least 2 characters long'),
  checked: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;