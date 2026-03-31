'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return { handleLogout };
}
