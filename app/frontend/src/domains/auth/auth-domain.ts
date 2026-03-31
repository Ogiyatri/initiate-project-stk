import { User, UserRole, UserStatus } from '@/types/login';

export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role;
}

export function isAdmin(user: User | null): boolean {
  return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
}

export function isSuperAdmin(user: User | null): boolean {
  return user?.role === UserRole.SUPER_ADMIN;
}

export function isUser(user: User | null): boolean {
  return user?.role === UserRole.USER;
}

export function isActive(user: User | null): boolean {
  return user?.status === UserStatus.ACTIVE;
}

export function getRedirectPathByRole(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return '/dashboard';
    case UserRole.USER:
      return '/dashboard';
    default:
      return '/login';
  }
}
