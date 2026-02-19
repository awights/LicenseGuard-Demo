'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, isAdmin } from '@/lib/auth';
import { User } from '@/lib/types';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Redirect to login if not authenticated (except on login/pricing pages)
    if (!currentUser && pathname !== '/login' && pathname !== '/pricing') {
      router.push('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Don't show nav on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/licenses', label: 'Licenses', icon: '📋' },
    { href: '/ce-credits', label: 'CE Credits', icon: '📚' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/team', label: 'Team', icon: '👥', adminOnly: true },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/pricing', label: 'Pricing', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">🛡️ LicenseGuard</span>
              </Link>

              {/* Nav Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navItems.map((item) => {
                  if (item.adminOnly && !isAdmin(user)) return null;
                  
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin(user)) return null;
              
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 LicenseGuard. Simplifying compliance for insurance professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}
