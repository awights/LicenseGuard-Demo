'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, DEMO_USERS } from '@/lib/auth';
import { initializeDemoData } from '@/lib/storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Initialize demo data on first login
    initializeDemoData();

    const user = login(email, password);
    if (user) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Try demo accounts below.');
    }
  };

  const quickLogin = (userType: 'admin' | 'member') => {
    const user = DEMO_USERS[userType];
    setEmail(user.email);
    setPassword('demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LicenseGuard</h1>
          <p className="text-gray-600">
            Insurance License & Permit Lifecycle Manager
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@agency.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 font-medium">Demo Accounts (any password):</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('admin')}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
              >
                <div className="font-medium text-gray-900">Agency Admin</div>
                <div className="text-sm text-gray-600">admin@acmeinsurance.com</div>
              </button>
              <button
                onClick={() => quickLogin('member')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
              >
                <div className="font-medium text-gray-900">Team Member</div>
                <div className="text-sm text-gray-600">sarah@acmeinsurance.com</div>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">What's Included:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Track all licenses & certifications</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>90/60/30-day renewal alerts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Document storage & management</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Team collaboration tools</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
              View Pricing
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
