import * as React from "react";
import { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";
import { LoginFormData } from "@/domains/login/login-domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  register: UseFormRegister<LoginFormData>;
  handleSubmit: (
    onSubmit: SubmitHandler<LoginFormData>,
  ) => (e: React.FormEvent) => void;
  errors: FieldErrors<LoginFormData>;
  isPending: boolean;
  onSubmit: SubmitHandler<LoginFormData>;
}

export function LoginForm({
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-primary-foreground p-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">STK</h1>
          <p className="text-xl opacity-80">Sistem Manajemen</p>
          <p className="text-lg opacity-60 mt-2">Selamat datang kembali</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Masuk</h2>
            <p className="text-muted-foreground mt-2">
              Masukkan email dan password Anda
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@stk.id"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Memuat..." : "Masuk"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
