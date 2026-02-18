# 🛡️ LicenseGuard

**Insurance License & Permit Lifecycle Manager**

LicenseGuard is a comprehensive web application designed to help insurance agents and agencies track, manage, and renew their professional licenses and certifications. Never miss a renewal deadline again!

![License Status](https://img.shields.io/badge/status-prototype-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🌟 Features

### Core Functionality
- **License Tracking Dashboard** - Visual status indicators (active, expiring soon, expired) for all licenses
- **Smart Renewal Alerts** - Automatic notifications at 90, 60, and 30 days before expiration
- **Calendar View** - See all renewal dates at a glance with an interactive calendar
- **Document Management** - Upload and store license documents (PDF, JPG, PNG)
- **Team Management** - Admin dashboard to manage team members and their licenses
- **Multi-State Support** - Track licenses across all 50 US states
- **Insurance-Specific** - Pre-configured license types for the insurance industry
- **NIPR Integration** - Direct links to National Insurance Producer Registry for license renewals
- **Sircon CE Tracking** - Integrated continuing education credit tracking and compliance monitoring
- **Profile Management** - Save National Producer Number (NPN) and SSN last 4 for quick access
- **CE Credit Dashboard** - Track completed vs required CE hours by state with progress indicators

### License Types Supported
- State Producer Licenses
- Life & Health Insurance
- Property & Casualty (P&C)
- E&O Insurance
- Continuing Education (CE) Credits
- FINRA Series (6, 7, 63, 65)

### User Roles
- **Agency Admin** - Full access to manage team, view all licenses, add/edit/delete
- **Team Member** - View and manage their own licenses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd licenseguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Accounts

The application comes with pre-configured demo accounts:

**Agency Admin:**
- Email: `admin@acmeinsurance.com`
- Password: `any password` (mock authentication)
- Access: Full admin privileges, team management, all licenses

**Team Member:**
- Email: `sarah@acmeinsurance.com`
- Password: `any password` (mock authentication)
- Access: Personal licenses only

## 📖 Usage Guide

### Getting Started

1. **Login** - Use one of the demo accounts or the quick login buttons on the login page
2. **Dashboard** - View your license overview and upcoming renewals
3. **Add License** - Click "Add License" to track a new license or certification
4. **Set Renewal Dates** - Enter expiry dates to receive automatic alerts
5. **Upload Documents** - Attach digital copies of your licenses
6. **Invite Team** (Admin only) - Add team members and assign licenses

### Navigation

- **Dashboard** 📊 - Overview of all licenses and upcoming renewals with quick links to NIPR and Sircon
- **Licenses** 📋 - Manage all licenses (add, edit, delete, filter) with direct NIPR renewal access
- **CE Credits** 📚 - Track continuing education requirements and completion status by state
- **Calendar** 📅 - Visual calendar of all renewal dates
- **Team** 👥 - Manage team members (Admin only)
- **Profile** 👤 - Manage personal information, NPN, and SSN last 4 for quick renewals

### Status Indicators

- **🟢 Green (Active)** - License is valid with 90+ days until expiration
- **🟡 Yellow (Expiring Soon)** - License expires within 90 days
- **🔴 Red (Expired)** - License has expired

## 💰 Pricing Plans

### Individual - $19/month
- Perfect for solo insurance agents
- Unlimited license tracking
- 90/60/30-day renewal alerts
- 100MB document storage
- Mobile app access

### Team - $99/month
- Ideal for agencies with 5 agents
- Everything in Individual
- Team management dashboard
- $15/month per additional seat
- 1GB document storage
- Bulk license upload

### Enterprise - Custom Pricing
- For agencies with 10+ agents
- Everything in Team
- Unlimited storage
- Custom integrations
- SSO authentication
- Dedicated support
- API access

## 🏗️ Technical Stack

- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Storage:** Browser localStorage (prototype)
- **State Management:** React Hooks
- **Routing:** Next.js App Router

## 📁 Project Structure

```
licenseguard/
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── licenses/           # License management page
│   ├── calendar/           # Calendar view page
│   ├── team/               # Team management page (admin)
│   ├── pricing/            # Pricing page
│   ├── login/              # Login page
│   ├── page.tsx            # Home page (redirects)
│   └── layout.tsx          # Root layout
├── components/
│   ├── Layout.tsx          # Main layout with navigation
│   └── StatusBadge.tsx     # License status badge component
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── auth.ts             # Mock authentication
│   ├── storage.ts          # localStorage utilities
│   └── constants.ts        # App constants and config
├── public/                 # Static assets
├── README.md               # This file
└── DEVELOPMENT.md          # Development documentation
```

## 🔐 Security Note

**This is a prototype using mock authentication and browser localStorage.**

For production use, you would need to implement:
- Real user authentication (Auth0, Clerk, NextAuth.js)
- Backend API (Node.js, Python, etc.)
- Database (PostgreSQL, MongoDB, etc.)
- File storage (S3, CloudFlare R2, etc.)
- Email service (SendGrid, Postmark, etc.)
- HTTPS/SSL encryption
- Role-based access control (RBAC)

See [DEVELOPMENT.md](./DEVELOPMENT.md) for production recommendations.

## 🎯 Use Cases

- **Solo Insurance Agents** - Track personal licenses across multiple states
- **Insurance Agencies** - Manage team licenses and ensure compliance
- **Broker-Dealers** - Track FINRA certifications for advisors
- **Compliance Officers** - Monitor team licensing status
- **New Agents** - Stay on top of initial licensing requirements

## 🤝 Contributing

This is a prototype/demo application. For production implementation or customization, please contact the development team.

## 📄 License

Proprietary - All Rights Reserved

## 📞 Support

For questions or demo requests, please contact:
- Email: support@licenseguard.com (demo only)
- Website: https://licenseguard.com (demo only)

## 🙏 Acknowledgments

Built with ❤️ for insurance professionals who want to focus on serving clients, not tracking paperwork.

---

**Status:** Prototype/Demo Version  
**Last Updated:** February 2024  
**Version:** 1.0.0
