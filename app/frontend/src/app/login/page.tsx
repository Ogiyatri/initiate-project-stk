"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { useLoginForm } from "@/hooks/login/use-login-form";

export default function LoginPage() {
  const { register, handleSubmit, errors, isPending, onSubmit } =
    useLoginForm();

  return (
    <LoginForm
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
}
