// Constants and configuration
import { LicenseType } from './types';

export const LICENSE_TYPES: LicenseType[] = [
  'Life & Health',
  'Property & Casualty',
  'E&O Insurance',
  'Fixed & Variable Annuities',
  'FINRA Series 6',
  'FINRA Series 7',
  'FINRA Series 63',
  'FINRA Series 65',
  'Certification',
];

export const POLICY_TYPES_LIST: LicenseType[] = [
  'Workers Comp',
  'Property',
  'Liability',
  'Business Owners',
  'E&O Insurance',
];

export const ALL_LICENSE_AND_POLICY_TYPES: LicenseType[] = [
  ...LICENSE_TYPES,
  'Workers Comp',
  'Property',
  'Liability',
  'Business Owners',
];

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'Multi-State'
];

export const PRICING_PLANS = {
  individual: {
    name: 'Individual',
    price: 29,
    annualPrice: 24, // $288/year (save $60)
    seats: 1,
    savingsText: 'Save $60/year',
    features: [
      'Unlimited license tracking',
      '90/60/30-day renewal alerts',
      '500 MB secure document storage',
      'Calendar & dashboard view',
      'Mobile app (iOS & Android)',
      'Email support (24hr response)',
      'State-specific compliance tracking',
      'CE credit hour tracking'
    ],
    limits: {
      storage: '500 MB',
      users: 1,
      support: 'Email (24hr)'
    }
  },
  agency: {
    name: 'Agency',
    price: 199,
    annualPrice: 166, // $1,992/year (save $396)
    seats: 10,
    additionalSeatPrice: 19,
    savingsText: 'Save $396/year',
    features: [
      'Everything in Individual, plus:',
      'Up to 10 agents included',
      'Only $19/month per additional agent',
      'Team-wide compliance dashboard',
      'Centralized license management',
      'Bulk upload & import tools',
      '10 GB secure document storage',
      'Custom alert schedules',
      'Manager approval workflows',
      'Audit-ready reports & exports',
      'Priority support (4hr response)',
      'Onboarding & training session'
    ],
    limits: {
      storage: '10 GB',
      users: '10 included',
      support: 'Priority (4hr)',
      additionalSeat: '$19/month'
    },
    badge: 'Most Popular',
    recommended: true
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    annualPrice: 'Contact Sales',
    seats: '50+',
    savingsText: 'Volume discounts available',
    features: [
      'Everything in Agency, plus:',
      'Unlimited agents & seats',
      'Unlimited document storage',
      'Dedicated account manager',
      'White-glove onboarding (30-60 days)',
      'Custom integrations (AMS, CRM)',
      'SSO & SAML authentication',
      'Advanced security & compliance',
      'Custom reporting & analytics',
      'API access & webhooks',
      'Multi-location management',
      'Priority phone support (1hr SLA)',
      'Quarterly business reviews',
      'Custom contract terms'
    ],
    limits: {
      storage: 'Unlimited',
      users: '50+ agents',
      support: 'Dedicated + Phone (1hr SLA)',
      additionalSeat: 'Volume pricing'
    },
    isEnterprise: true
  }
};

export const NOTIFICATION_THRESHOLDS = {
  NINETY_DAYS: 90,
  SIXTY_DAYS: 60,
  THIRTY_DAYS: 30,
};
