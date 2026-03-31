import { z } from "zod";
import { AxiosError } from "axios";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function formatLoginError(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message[0];
    const errorMsg = error.response?.data?.error;
    if (typeof errorMsg === "string") return errorMsg;
  }
  return "Email atau password salah";
}
