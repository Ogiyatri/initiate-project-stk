"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/api/use-auth";
import { useAuthStore } from "@/stores/auth";
import {
  loginSchema,
  LoginFormData,
  formatLoginError,
} from "@/domains/login/login-domain";
import { getRedirectPathByRole } from "@/domains/auth/auth-domain";

export function useLoginForm() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { setUser, setAccessToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    login(data, {
      onSuccess: (result) => {
        setUser(result.user);
        setAccessToken(result.accessToken);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        const redirectPath = getRedirectPathByRole(result.user.role);
        router.push(redirectPath);
      },
      onError: (error) => {
        setError("email", { message: formatLoginError(error) });
      },
    });
  };

  return { register, handleSubmit, errors, isPending, onSubmit };
}
