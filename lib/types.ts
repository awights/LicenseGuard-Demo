// Core types for LicenseGuard

export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  agencyId: string;
  npn?: string; // National Producer Number
  ssnLast4?: string; // Last 4 digits of SSN
  crdNumber?: string; // CRD Number (Central Registration Depository)
  dateOfBirth?: string; // Date of Birth
}

export interface Agency {
  id: string;
  name: string;
  planType: 'individual' | 'team' | 'enterprise';
  maxSeats: number;
  currentSeats: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  fein?: string;
  licenseNumber?: string;
}

export type LicenseType = 
  | 'Life & Health'
  | 'Property & Casualty'
  | 'E&O Insurance'
  | 'Fixed & Variable Annuities'
  | 'FINRA Series 6'
  | 'FINRA Series 7'
  | 'FINRA Series 63'
  | 'FINRA Series 65'
  | 'Certification';

export type LicenseStatus = 'active' | 'expiring-soon' | 'expired';

export interface License {
  id: string;
  userId: string;
  type: LicenseType;
  licenseNumber: string;
  state: string;
  issueDate: string;
  expiryDate: string;
  renewalLink?: string;
  status: LicenseStatus;
  documents: Document[];
  notes?: string;
  isResidentState?: boolean;
  certificationName?: string;
}

export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  type: string;
  data: string; // base64 for localStorage
}

export interface Notification {
  id: string;
  licenseId: string;
  type: '90-day' | '60-day' | '30-day';
  sentDate: string;
  message: string;
}

export interface DashboardStats {
  totalLicenses: number;
  activeLicenses: number;
  expiringSoon: number;
  expired: number;
  teamMembers: number;
}

export interface CECredit {
  id: string;
  userId: string;
  state: string;
  hoursRequired: number;
  hoursCompleted: number;
  courseName?: string;
  completionDate?: string;
  provider?: string;
  expiryDate: string;
}
