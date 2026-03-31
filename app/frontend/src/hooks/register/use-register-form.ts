"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/api/use-auth";
import { useAuthStore } from "@/stores/auth";
import {
  registerSchema,
  RegisterFormData,
  formatRegisterError,
} from "@/domains/register/register-domain";

export function useRegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const { setUser, setAccessToken } = useAuthStore();

  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    const { confirmPassword: _confirm, ...payload } = data;
    void _confirm;
    register(payload, {
      onSuccess: (result) => {
        setUser(result.user as Parameters<typeof setUser>[0]);
        setAccessToken(result.accessToken);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        router.push("/dashboard");
      },
      onError: (error) => {
        setError("email", { message: formatRegisterError(error) });
      },
    });
  };

  return { register: registerField, handleSubmit, errors, isPending, onSubmit };
}
