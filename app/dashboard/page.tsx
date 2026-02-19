'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { getCurrentUser } from '@/lib/auth';
import { getLicenses, getUsers, getDaysUntilExpiry, formatDate } from '@/lib/storage';
import { License, DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLicenses: 0,
    activeLicenses: 0,
    expiringSoon: 0,
    expired: 0,
    teamMembers: 0,
  });
  const [recentLicenses, setRecentLicenses] = useState<License[]>([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState<License[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const allLicenses = getLicenses();
    const userLicenses = user.role === 'admin' 
      ? allLicenses 
      : allLicenses.filter(l => l.userId === user.id);

    // Calculate stats
    const newStats: DashboardStats = {
      totalLicenses: userLicenses.length,
      activeLicenses: userLicenses.filter(l => l.status === 'active').length,
      expiringSoon: userLicenses.filter(l => l.status === 'expiring-soon').length,
      expired: userLicenses.filter(l => l.status === 'expired').length,
      teamMembers: getUsers().length,
    };
    setStats(newStats);

    // Recent licenses (last 5)
    const sorted = [...userLicenses].sort((a, b) => 
      new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    );
    setRecentLicenses(sorted.slice(0, 5));

    // Upcoming renewals (expiring within 90 days, sorted by expiry)
    const upcoming = userLicenses
      .filter(l => {
        const days = getDaysUntilExpiry(l.expiryDate);
        return days >= 0 && days <= 90;
      })
      .sort((a, b) => 
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      )
      .slice(0, 5);
    setUpcomingRenewals(upcoming);
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your license compliance status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Licenses"
            value={stats.totalLicenses}
            icon="📋"
            color="blue"
            href="/licenses"
          />
          <StatCard
            title="Active"
            value={stats.activeLicenses}
            icon="✓"
            color="green"
            href="/licenses?status=active"
          />
          <StatCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon="⚠️"
            color="yellow"
            href="/licenses?status=expiring-soon"
          />
          <StatCard
            title="Expired"
            value={stats.expired}
            icon="✗"
            color="red"
            href="/licenses?status=expired"
          />
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Licenses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Licenses</h2>
              <Link
                href="/licenses"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>

            {recentLicenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>No licenses yet</p>
                <Link
                  href="/licenses"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Your First License
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLicenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Renewals</h2>
              <Link
                href="/calendar"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Calendar →
              </Link>
            </div>

            {upcomingRenewals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">✓</div>
                <p>No upcoming renewals</p>
                <p className="text-sm mt-2">All licenses are up to date!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingRenewals.map((license) => (
                  <RenewalCard key={license.id} license={license} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/licenses"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl mr-4">➕</span>
              <div>
                <div className="font-medium text-gray-900">Add License</div>
                <div className="text-sm text-gray-600">Track a new license</div>
              </div>
            </Link>
            <Link
              href="/ce-credits"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl mr-4">📚</span>
              <div>
                <div className="font-medium text-gray-900">CE Credits</div>
                <div className="text-sm text-gray-600">Track education hours</div>
              </div>
            </Link>
            <Link
              href="/calendar"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl mr-4">📅</span>
              <div>
                <div className="font-medium text-gray-900">View Calendar</div>
                <div className="text-sm text-gray-600">See all renewal dates</div>
              </div>
            </Link>
            <Link
              href="/profile"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl mr-4">👤</span>
              <div>
                <div className="font-medium text-gray-900">Profile</div>
                <div className="text-sm text-gray-600">Update NPN & SSN</div>
              </div>
            </Link>
          </div>
        </div>

        {/* External Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NIPR Portal */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">NIPR Portal</h3>
                <p className="text-blue-100 text-sm">
                  National Insurance Producer Registry
                </p>
              </div>
              <span className="text-5xl">🏛️</span>
            </div>
            <p className="text-blue-50 text-sm mb-4">
              Manage all your state insurance license renewals in one place. 
              Access your producer profile and start renewals.
            </p>
            <a
              href="https://hub.app.nipr.com/my-nipr/frontend/identify-licensee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              Go to NIPR →
            </a>
          </div>

          {/* Sircon CE Tracking */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Sircon CE Tracker</h3>
                <p className="text-green-100 text-sm">
                  Continuing Education Compliance
                </p>
              </div>
              <span className="text-5xl">📚</span>
            </div>
            <p className="text-green-50 text-sm mb-4">
              Check your CE credit status by state. View completed vs required hours 
              and ensure compliance for your license renewals.
            </p>
            <a
              href="https://www.sircon.com/ComplianceExpress/NonSscrbEducation/index.jsp?nonSscrb=Y&sscrbid=9999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium transition-colors"
            >
              Check CE Status →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color, href }: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
  href: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <Link href={href} className="bg-white rounded-lg shadow p-6 hover:shadow-md hover:ring-2 hover:ring-blue-200 transition-all cursor-pointer block">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`text-4xl p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Link>
  );
}

function LicenseCard({ license }: { license: License }) {
  const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{license.type}</h3>
          <p className="text-sm text-gray-600">{license.licenseNumber}</p>
        </div>
        <StatusBadge status={license.status} daysUntilExpiry={daysUntilExpiry} />
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">State:</span> {license.state} •{' '}
        <span className="font-medium">Expires:</span> {formatDate(license.expiryDate)}
      </div>
    </div>
  );
}

function RenewalCard({ license }: { license: License }) {
  const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);

  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{license.type}</h3>
          <p className="text-sm text-gray-600">{license.licenseNumber}</p>
        </div>
        <span className="text-sm font-medium text-yellow-800">
          {daysUntilExpiry} days
        </span>
      </div>
      <p className="text-sm text-gray-700">
        Expires: {formatDate(license.expiryDate)}
      </p>
      {license.renewalLink && (
        <a
          href={license.renewalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
        >
          Renew Now →
        </a>
      )}
    </div>
  );
}
