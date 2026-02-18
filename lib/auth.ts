// Mock authentication system
import { User } from './types';

const STORAGE_KEY = 'licenseguard_current_user';

// Demo users
export const DEMO_USERS = {
  admin: {
    id: 'user-1',
    email: 'admin@acmeinsurance.com',
    name: 'Alex Thompson',
    role: 'admin' as const,
    agencyId: 'agency-1',
  },
  member: {
    id: 'user-2',
    email: 'sarah@acmeinsurance.com',
    name: 'Sarah Johnson',
    role: 'member' as const,
    agencyId: 'agency-1',
  },
};

export function login(email: string, password: string): User | null {
  // Mock login - accept any password for demo users
  const user = Object.values(DEMO_USERS).find(u => u.email === email);
  
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}
