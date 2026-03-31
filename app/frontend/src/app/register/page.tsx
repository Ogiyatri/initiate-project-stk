"use client";

import { RegisterForm } from "@/components/register/RegisterForm";
import { useRegisterForm } from "@/hooks/register/use-register-form";

export default function RegisterPage() {
  const { register, handleSubmit, errors, isPending, onSubmit } =
    useRegisterForm();

  return (
    <RegisterForm
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
}
