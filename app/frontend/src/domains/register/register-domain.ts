import { z } from 'zod';
import { AxiosError } from 'axios';

export const registerSchema = z
  .object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
    fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export function formatRegisterError(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message[0];
    const errorMsg = error.response?.data?.error;
    if (typeof errorMsg === 'string') return errorMsg;
  }
  return 'Pendaftaran gagal, silakan coba lagi';
}
