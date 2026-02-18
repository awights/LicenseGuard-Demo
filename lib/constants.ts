// Constants and configuration
import { LicenseType } from './types';

export const LICENSE_TYPES: LicenseType[] = [
  'State Producer',
  'Life & Health',
  'Property & Casualty',
  'E&O Insurance',
  'CE Credits',
  'FINRA Series 6',
  'FINRA Series 7',
  'FINRA Series 63',
  'FINRA Series 65',
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
    price: 19,
    seats: 1,
    features: [
      'Unlimited license tracking',
      'Renewal email alerts (90/60/30 days)',
      'Document storage (up to 100MB)',
      'Calendar view',
      'Mobile app access',
      'Email support'
    ]
  },
  team: {
    name: 'Team',
    price: 99,
    seats: 5,
    additionalSeatPrice: 15,
    features: [
      'Everything in Individual',
      'Up to 5 team members',
      '$15/month per additional seat',
      'Team license management',
      'Admin dashboard',
      'Document storage (up to 1GB)',
      'Priority email support',
      'Bulk license upload'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    seats: '10+',
    features: [
      'Everything in Team',
      '10+ team members',
      'Unlimited document storage',
      'Custom integrations',
      'SSO authentication',
      'Dedicated account manager',
      'Phone & priority support',
      'Custom reporting',
      'API access'
    ]
  }
};

export const NOTIFICATION_THRESHOLDS = {
  NINETY_DAYS: 90,
  SIXTY_DAYS: 60,
  THIRTY_DAYS: 30,
};
