import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { LoginRequest, LoginResponse } from '@/types/login';
import { RegisterRequest, RegisterResponse } from '@/types/register';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
      return response.data;
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
      return response.data;
    },
  });
}
