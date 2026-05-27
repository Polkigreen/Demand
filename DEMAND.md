# Demand — Cross-platform Marketplace Monorepo

A Swedish task/gig marketplace app built with **Next.js** (web), **Flutter** (mobile), and **NestJS** (backend).

---

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Web       | Next.js 15, React 19, Tailwind CSS, Zustand |
| Mobile    | Flutter 3+, Riverpod, GoRouter, Dio |
| Backend   | NestJS 10, Passport JWT, Prisma     |
| Database  | PostgreSQL                          |
| Payments  | Stripe Connect (escrow)             |
| Auth      | BankID, Google OAuth, Email/Password |
| SMS       | 46elks API                          |
| Monorepo  | pnpm workspaces, Turborepo          |

---

## Project Structure

```
Demand/
├── apps/
│   ├── web/                 # Next.js web app
│   │   └── src/
│   │       ├── app/         # Pages (feed, login, post, chat, profile)
│   │       ├── lib/         # API client layer
│   │       └── store/       # Zustand auth store
│   └── mobile/              # Flutter mobile app
│       └── lib/
│           ├── core/        # Theme, router, storage, API
│           └── features/    # Screens (auth, feed, chat, post, profile)
├── packages/
│   ├── backend/             # NestJS API server
│   │   └── src/
│   │       ├── auth/        # BankID, Google, Email auth
│   │       ├── users/       # User profile CRUD
│   │       ├── requests/    # Task request CRUD + geo search
│   │       ├── payments/    # Stripe Connect escrow
│   │       ├── notifications/ # SMS OTP (46elks)
│   │       └── tax/         # Swedish Hobbyverksamhet tracker
│   ├── database/            # Prisma schema + client
│   └── shared/              # Shared TypeScript types
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## Backend API Endpoints

### Auth
| Method | Path                    | Auth  | Description             |
| ------ | ----------------------- | ----- | ----------------------- |
| POST   | `/auth/bankid/initiate` | —     | Start BankID auth       |
| POST   | `/auth/bankid/collect`  | —     | Poll BankID status      |
| POST   | `/auth/google`          | —     | Google OAuth login      |
| POST   | `/auth/email/register`  | —     | Email/password register |
| POST   | `/auth/email/login`     | —     | Email/password login    |
| POST   | `/auth/refresh`         | —     | Refresh JWT tokens      |

### Users
| Method | Path          | Auth          | Description                    |
| ------ | ------------- | ------------- | ------------------------------ |
| GET    | `/users/me`   | JWT required  | Get own profile                |
| PATCH  | `/users/me`   | JWT required  | Update own profile             |
| DELETE | `/users/me`   | JWT required  | GDPR anonymize account         |

### Requests
| Method | Path                  | Auth          | Description              |
| ------ | --------------------- | ------------- | ------------------------ |
| GET    | `/requests`           | —             | List all requests        |
| GET    | `/requests/nearby`    | —             | Geo-radius search        |
| GET    | `/requests/:id`       | —             | Get single request       |
| POST   | `/requests`           | JWT required  | Create a request         |
| PATCH  | `/requests/:id`       | JWT required  | Update own request       |
| DELETE | `/requests/:id`       | JWT required  | Delete own request       |

### Notifications
| Method | Path                            | Auth          | Description          |
| ------ | ------------------------------- | ------------- | -------------------- |
| POST   | `/notifications/sms/send-otp`   | JWT required  | Send SMS OTP         |
| POST   | `/notifications/sms/verify-otp` | JWT required  | Verify OTP code      |

---

## Database Schema (Prisma)

**Models:** `User`, `Request`, `Application`, `Booking`, `Message`, `Payment`, `Review`, `Notification`, `YearlyTaxSummary`

Key enums: `Role` (REQUESTER/HELPER), `RequestStatus`, `ApplicationStatus`, `BookingStatus`, `PaymentStatus`

Swedish-specific fields:
- `personnummer` — Swedish personal identity number (encrypted)
- `bankidVerified` — BankID verification status
- `hasFskatt` — F-skatt certificate status
- `orgNumber` / `vatNumber` — Business registration

---

## Features

### Authentication
- **BankID** — Real BankID v6.0 API integration with mock fallback for development
- **Google OAuth** — Mock implementation ready for `google-auth-library`
- **Email/Password** — Full password hashing with scrypt + constant-time verification

### Marketplace
- **Request CRUD** — Post, browse, update, and delete task requests
- **Geospatial search** — Haversine formula for nearby requests
- **Applications** — Helpers can apply with price proposals
- **Bookings** — Schedule and manage task bookings
- **In-app messaging** — Chat between requesters and helpers

### Payments (Stripe)
- **Stripe Connect Express** — Helper account creation and onboarding
- **Escrow system** — Hold funds on booking, release 90% to helper on completion (10% platform fee)
- **Refunds** — Full refund support

### Swedish Compliance
- **Hobbyverksamhet Tracker** — Track earnings against Skatteverket limits (24,300 SEK)
- **Yearly Tax Summaries** — Per-helper, per-requester annual reports
- **KU30 flagging** — Alerts when a single payer exceeds 10,000 SEK
- **GDPR compliance** — Full account anonymization endpoint

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm --filter @demand/database build

# Start backend (http://localhost:4000)
pnpm --filter @demand/backend dev

# Start web app (http://localhost:3000)
pnpm --filter @demand/web dev

# Start mobile app
pnpm --filter demand mobile:run
```

### Environment Variables (backend)

```
DATABASE_URL=postgresql://...
JWT_SECRET=access-secret-2026
JWT_REFRESH_SECRET=refresh-secret-2026
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ELKS_API_USER=...
ELKS_API_PASSWORD=...
BANKID_CLIENT_CERT=...
BANKID_CLIENT_KEY=...
```

### Environment Variables (web)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Recent Improvements

### Backend Fixes
- **Password auth** — Passwords are now properly hashed on registration and verified on login (was previously discarded)
- **SQL injection** — `$queryRawUnsafe` replaced with parameterized `Prisma.sql` in geospatial search
- **Dead modules revived** — `NotificationsModule`, `PaymentsModule`, `TaxModule` are now imported and functional
- **Full request CRUD** — Added create/read/update/delete endpoints with ownership checks
- **Missing `passwordHash`** — Added field to Prisma User model
- **Missing `stripe` package** — Added to backend dependencies

### Web Frontend — Orange & White Theme
- Re-themed from dark teal to light orange-and-white
- Orange (`#FF7A00`) primary color throughout
- White backgrounds, clean light borders
- All broken Tailwind classes fixed (non-standard shades like `slate-350` removed)

### Real API Integration
- API client with auto token refresh on 401
- Login/register calls real backend endpoints
- Home feed fetches from `GET /requests`
- Post task submits to `POST /requests`
- Profile fetches from and saves to backend
- Loading/error states on all pages

### Flutter Mobile
- `ApiService` now has endpoint methods for auth, requests, and users
