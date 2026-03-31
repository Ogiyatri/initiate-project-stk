import * as React from "react";
import { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";
import { RegisterFormData } from "@/domains/register/register-domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormData>;
  handleSubmit: (
    onSubmit: SubmitHandler<RegisterFormData>,
  ) => (e: React.FormEvent) => void;
  errors: FieldErrors<RegisterFormData>;
  isPending: boolean;
  onSubmit: SubmitHandler<RegisterFormData>;
}

export function RegisterForm({
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
}: RegisterFormProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-primary-foreground p-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">STK</h1>
          <p className="text-xl opacity-80">Sistem Manajemen</p>
          <p className="text-lg opacity-60 mt-2">Bergabung dengan kami</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Daftar</h2>
            <p className="text-muted-foreground mt-2">Buat akun baru Anda</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nama Lengkap"
                {...register("fullName")}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
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
              <Label htmlFor="phone">Nomor Telepon (opsional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                {...register("phone")}
              />
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Masuk sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
