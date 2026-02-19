// Local storage utilities for prototype
import { License, User, Agency, Document, LicenseStatus } from './types';

const LICENSES_KEY = 'licenseguard_licenses';
const USERS_KEY = 'licenseguard_users';
const AGENCY_KEY = 'licenseguard_agency';

// Initialize demo data
export function initializeDemoData() {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  if (localStorage.getItem(LICENSES_KEY)) return;
  
  const demoLicenses: License[] = [
    {
      id: 'lic-1',
      userId: 'user-1',
      type: 'Life & Health',
      licenseNumber: 'CA-12345678',
      state: 'CA',
      issueDate: '2023-01-15',
      expiryDate: '2025-01-15',
      renewalLink: 'https://insurance.ca.gov/renewals',
      status: 'active',
      documents: [],
      notes: 'Primary California producer license'
    },
    {
      id: 'lic-2',
      userId: 'user-1',
      type: 'Life & Health',
      licenseNumber: 'NY-87654321',
      state: 'NY',
      issueDate: '2022-06-01',
      expiryDate: '2024-06-01',
      status: 'expired',
      documents: [],
    },
    {
      id: 'lic-3',
      userId: 'user-1',
      type: 'Property & Casualty',
      licenseNumber: 'TX-99887766',
      state: 'TX',
      issueDate: '2024-03-10',
      expiryDate: '2026-03-10',
      renewalLink: 'https://tdi.texas.gov/renewals',
      status: 'active',
      documents: [],
    },
    {
      id: 'lic-4',
      userId: 'user-2',
      type: 'Fixed & Variable Annuities',
      licenseNumber: 'FVA-2024-001',
      state: 'FL',
      issueDate: '2024-01-01',
      expiryDate: '2024-12-31',
      status: 'expiring-soon',
      documents: [],
      notes: 'Need 24 hours of CE credits'
    },
    {
      id: 'lic-5',
      userId: 'user-1',
      type: 'E&O Insurance',
      licenseNumber: 'EO-2024-789',
      state: 'Multi-State',
      issueDate: '2024-01-01',
      expiryDate: '2024-04-15',
      status: 'expiring-soon',
      documents: [],
      notes: '$1M coverage, renewal needed'
    }
  ];
  
  const demoUsers: User[] = [
    {
      id: 'user-1',
      email: 'admin@acmeinsurance.com',
      name: 'Alex Thompson',
      role: 'admin',
      agencyId: 'agency-1',
    },
    {
      id: 'user-2',
      email: 'sarah@acmeinsurance.com',
      name: 'Sarah Johnson',
      role: 'member',
      agencyId: 'agency-1',
    },
    {
      id: 'user-3',
      email: 'mike@acmeinsurance.com',
      name: 'Mike Davis',
      role: 'member',
      agencyId: 'agency-1',
    }
  ];
  
  const demoAgency: Agency = {
    id: 'agency-1',
    name: 'Acme Insurance Agency',
    planType: 'team',
    maxSeats: 5,
    currentSeats: 3,
  };
  
  localStorage.setItem(LICENSES_KEY, JSON.stringify(demoLicenses));
  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  localStorage.setItem(AGENCY_KEY, JSON.stringify(demoAgency));
}

// License CRUD operations
export function getLicenses(): License[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LICENSES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getLicensesByUser(userId: string): License[] {
  return getLicenses().filter(l => l.userId === userId);
}

export function getLicenseById(id: string): License | null {
  return getLicenses().find(l => l.id === id) || null;
}

export function saveLicense(license: License): void {
  const licenses = getLicenses();
  const index = licenses.findIndex(l => l.id === license.id);
  
  // Update license status based on expiry date
  license.status = calculateLicenseStatus(license.expiryDate);

  if (license.isResidentState) {
    licenses.forEach(l => {
      if (l.id !== license.id && l.userId === license.userId) {
        l.isResidentState = false;
      }
    });
  }
  
  if (index >= 0) {
    licenses[index] = license;
  } else {
    licenses.push(license);
  }
  
  localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
}

export function deleteLicense(id: string): void {
  const licenses = getLicenses().filter(l => l.id !== id);
  localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
}

// User operations
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getUserById(id: string): User | null {
  return getUsers().find(u => u.id === id) || null;
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Also delete their licenses
  const licenses = getLicenses().filter(l => l.userId !== id);
  localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
}

// Agency operations
export function getAgency(): Agency | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AGENCY_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveAgency(agency: Agency): void {
  localStorage.setItem(AGENCY_KEY, JSON.stringify(agency));
}

// Utility functions
export function calculateLicenseStatus(expiryDate: string): LicenseStatus {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 90) return 'expiring-soon';
  return 'active';
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  return Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Mock email notification
export function sendRenewalNotification(license: License, daysUntilExpiry: number): void {
  console.log(`📧 RENEWAL NOTIFICATION (Mock)`);
  console.log(`To: ${getUserById(license.userId)?.email}`);
  console.log(`Subject: License Renewal Alert - ${license.type}`);
  console.log(`Message: Your ${license.type} license (${license.licenseNumber}) expires in ${daysUntilExpiry} days.`);
  console.log(`Expiry Date: ${formatDate(license.expiryDate)}`);
  if (license.renewalLink) {
    console.log(`Renewal Link: ${license.renewalLink}`);
  }
  console.log('---');
}
