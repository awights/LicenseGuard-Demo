# LicenseGuard

## Overview
LicenseGuard is an Insurance License & Permit Lifecycle Manager built with Next.js 16, React 19, and Tailwind CSS 4. It allows users to track, manage, and renew insurance licenses and certifications.

## Project Architecture
- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19 + Tailwind CSS 4
- **Language**: TypeScript 5
- **Port**: 5000 (dev and production)

## Project Structure
- `app/` - Next.js App Router pages (login, dashboard, licenses, calendar, ce-credits, pricing, profile, team)
- `components/` - Shared React components (Layout, StatusBadge)
- `lib/` - Utility modules (auth, constants, storage, types)
- `public/` - Static assets

## Running
- Dev: `npm run dev` (runs on 0.0.0.0:5000)
- Build: `npm run build`
- Start: `npm run start`

## Recent Changes
- 2026-02-18: Initial Replit setup, configured port 5000, allowed dev origins for Replit proxy
