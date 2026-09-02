# ⚡ Instant Mechanic™ — Live Vehicle Service Operations Platform

> An enterprise-grade, full-stack SaaS dashboard for managing on-demand vehicle service operations in real-time. Built for the **Instant Mechanic** operations and dispatch team to monitor bookings, mechanic fleet allocation, customer requests, and business revenue — all in one centralized command center.

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=flat&logo=vercel)](https://client-theta-liard-65.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://instant-mechanic.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)

**Live Demo:** [https://client-theta-liard-65.vercel.app](https://client-theta-liard-65.vercel.app)  
**API Base URL:** [https://instant-mechanic.onrender.com/api/v1](https://instant-mechanic.onrender.com/api/v1)  
**GitHub Repository:** [https://github.com/Shivam000189/-Instant_Mechanic](https://github.com/Shivam000189/-Instant_Mechanic)

---

## 📌 Project Overview

### What Was Built
**Instant Mechanic™** is a full-stack, enterprise-grade operations and dispatch dashboard designed for on-demand vehicle roadside assistance and mobile repair businesses. It provides an all-in-one control center for dispatchers, operations managers, and administrators to monitor bookings in real time, assign mechanics, track fleet availability, and analyze revenue metrics.

### Why It Was Built
Traditional roadside mechanics and fleet operations face major dispatch delays, manual phone coordination, and lack of real-time visibility. This platform solves those operational bottlenecks by providing:
- **Instant visibility** into which mechanics are available, busy on a job, on break, or offline.
- **Real-time dispatch coordination** with live Server-Sent Events (SSE) so state changes reflect across all connected operators instantly without manual page refreshing.
- **Streamlined booking workflows** with end-to-end lifecycle tracking from *Pending* to *Completed*.
- **Executive financial and operational clarity** with revenue breakdown, service category demand, and workload distribution charts.

---

## 📸 Key Features & Highlights

- ⚡ **Real-Time Live Updates**: Built with **Server-Sent Events (SSE)** for automatic zero-refresh synchronization across the dashboard and notifications.
- 🔔 **Interactive Notification Center**: Real-time new bookings drawer with live counters, booking summaries, and direct navigation.
- 📊 **Executive Analytics & Stats**: 8 live operational metric cards, bookings over time trends, revenue distributions, status breakdowns, and service category bar charts.
- 📋 **Advanced Bookings Management**: Full data table with multi-parameter search, status filtering, sortable columns, pagination, and a comprehensive **Booking Details Modal** with status updater.
- 🔧 **Mechanic Fleet Tracking**: Fleet status monitoring, active jobs tracking, performance metrics, and a dedicated **Mechanic Details Modal**.
- 🌓 **Refined Design System**: Sleek cylindrical pill navigation, glassmorphic popovers, high-contrast status badges, dark/light theme switching, and responsive mobile-first layouts.
- 🏎️ **Public Marketing Page**: High-converting, animated agency-style landing page at `/landing`.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────┐
│             React 19 + TypeScript            │
│         Vite · Tailwind CSS · TanStack       │
│                  (Client / Vercel)           │
└──────────────────────┬───────────────────────┘
                       │
          HTTP REST    │   Server-Sent Events (SSE)
          Requests     │   Real-Time Broadcasts
                       ▼
┌──────────────────────────────────────────────┐
│             Node.js + Express 5              │
│               TypeScript API                 │
│                  (Server / Render)           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ (Prisma ORM)
┌──────────────────────────────────────────────┐
│           PostgreSQL Database (Neon)         │
│     Bookings · Mechanics · Customers · Logs  │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern reactive UI framework |
| **TypeScript** | Static typing and interfaces |
| **Vite 8** | Ultra-fast build tool and optimized manual chunking |
| **Tailwind CSS v4** | Utility-first styling with custom glassmorphism |
| **TanStack Query v5** | Server-state caching, background re-fetching, and optimistic invalidation |
| **Recharts** | Interactive responsive data visualizations |
| **React Router v7** | Client-side routing with SPA fallback |
| **Lucide React** | Consistent modern icon system |
| **Radix UI** | Accessible headless UI primitives (Dialogs, Dropdowns, Slots) |
| **date-fns** | Precise timestamp and schedule formatting |

### Backend (`server/`)
| Technology | Description |
| :--- | :--- |
| **Node.js & Express 5** | RESTful HTTP application server |
| **TypeScript** | End-to-end type safety |
| **Prisma ORM** | Schema migrations, relational models, and query generation |
| **PostgreSQL** | Robust relational database with pooling |
| **Server-Sent Events (SSE)** | Low-latency, unidirectional event stream for live updates |
| **Helmet & CORS** | Security headers and cross-origin resource sharing |

---

## 🌐 Routes & Endpoints

### 🖥️ Frontend Routes
| Route | Page | Description |
| :--- | :--- | :--- |
| `/` or `/dashboard` | **Dashboard** | 8 KPI stat cards, real-time charts (trends, revenue, breakdown, categories) |
| `/bookings` | **Bookings** | Paginated table, search by customer/vehicle, status filter, and details modal |
| `/mechanics` | **Mechanics** | Fleet cards with live status beacon dots, search, filter, and detail modal |
| `/landing` | **Landing Page** | Public-facing marketing page with scroll animations and service features |

### 🔌 Backend REST Endpoints (`/api/v1`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/dashboard?period=today` | Overview KPIs, trend charts, revenue, and category distribution |
| `GET` | `/bookings` | List bookings (supports `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`) |
| `GET` | `/bookings/:id` | Fetch single booking by ID with vehicle, customer, and mechanic details |
| `PATCH` | `/bookings/:id/status` | Update booking status (`pending`, `assigned`, `on_the_way`, `in_progress`, `completed`, `cancelled`) + **emits SSE event** |
| `GET` | `/mechanics` | List all mechanics (supports `status` and `search` query parameters) |
| `GET` | `/mechanics/:id` | Single mechanic details with completed jobs history & performance stats |
| `PATCH` | `/mechanics/:id/status` | Update mechanic availability (`available`, `busy`, `on_break`, `offline`) |
| `GET` | `/customers` | List all customer profiles |
| `GET` | `/customers/:id` | Single customer profile with booking history |
| `GET` | `/events/live` | **SSE Stream** for real-time live event broadcasts |

---

## 🚦 Status Lifecycle & Color Palette

```
  ┌─────────┐       ┌──────────┐       ┌────────────┐       ┌─────────────┐       ┌───────────┐
  │ Pending │  ──▶  │ Assigned │  ──▶  │ On The Way │  ──▶  │ In Progress │  ──▶  │ Completed │
  └────┬────┘       └────┬─────┘       └─────┬──────┘       └──────┬──────┘       └───────────┘
       │                 │                   │                     │
       └─────────────────┴───────────────────┴─────────────────────┴───▶ [ Cancelled ]
```

| Status | Category | Visual Palette | Live Dot Indicator |
| :--- | :--- | :--- | :--- |
| **Available / Completed** | Ready / Finished | Emerald (`#10b981`) text with `bg-emerald-500/15` | Pulsing green beacon (`#10b981`) |
| **Busy / In Progress** | Active Job | Sapphire Blue (`#3b82f6`) text with `bg-blue-500/15` | Pulsing blue beacon (`#3b82f6`) |
| **On Break / Pending** | Paused / Queued | Honey Amber (`#f59e0b`) text with `bg-amber-500/15` | Amber indicator (`#f59e0b`) |
| **On The Way** | En Route | Cyan Aqua (`#06b6d4`) text with `bg-cyan-500/15` | Pulsing cyan beacon (`#06b6d4`) |
| **Assigned** | Allocated | Royal Violet (`#8b5cf6`) text with `bg-violet-500/15` | Violet indicator (`#8b5cf6`) |
| **Cancelled** | Cancelled | Rose Crimson (`#f43f5e`) text with `bg-rose-500/15` | Rose indicator (`#f43f5e`) |
| **Offline** | Off Duty | Slate Grey (`#64748b`) text with `bg-slate-500/15` | Neutral slate dot (`#64748b`) |

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** `v18+` or `v20+`
- **npm** `v9+` or **yarn** / **pnpm**
- **PostgreSQL** instance (local or hosted via [Neon](https://neon.tech) / Supabase)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Shivam000189/-Instant_Mechanic.git
cd -Instant_Mechanic
```

---

### 2. Backend Setup (`server/`)

```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `server/.env` with your PostgreSQL database credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/instant_mechanic?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/instant_mechanic?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:5173"
CLIENT_URL="http://localhost:5173,http://localhost:3000"
```

Initialize the database schema and seed realistic mock data:
```bash
# Push database schema
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed 500+ realistic bookings, 50+ customers, and 20+ mechanics
npm run seed

# Start development server
npm run dev
```
> The backend server will start at: `http://localhost:5000` (API Base: `http://localhost:5000/api/v1`)

---

### 3. Frontend Setup (`client/`)

Open a new terminal window:

```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the Vite development server:
```bash
npm run dev
```
> The frontend application will run at: `http://localhost:5173`

---

## 📁 Directory Structure

```plaintext
-Instant_Mechanic/
├── client/                     # Frontend Application (React 19 + TypeScript + Vite)
│   ├── public/                 # Static assets, icons, _redirects
│   │   ├── _redirects          # SPA routing redirect for Netlify/Cloudflare
│   │   └── favicon.svg         # SVG Application Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── bookings/       # BookingTable, StatusBadge, BookingDetailsModal
│   │   │   ├── dashboard/      # StatCard, BookingsChart, RevenueChart, StatusPieChart, ServiceBarChart
│   │   │   ├── layout/         # Header, Sidebar, Layout, NotificationDropdown
│   │   │   ├── mechanics/      # MechanicDetailsModal
│   │   │   └── ui/             # Reusable UI primitives (Button, Card, Badge, Skeleton, SplashLoader)
│   │   ├── hooks/              # useSSE (Server-Sent Events hook)
│   │   ├── lib/                # api.ts (Axios client), utils.ts (tailwind merge)
│   │   ├── pages/              # DashboardPage, BookingsPage, MechanicsPage, LandingPage
│   │   ├── types/              # TypeScript interfaces (Booking, Mechanic, Customer, Overview)
│   │   ├── App.tsx             # Route definitions & React Query Provider
│   │   └── main.tsx            # React application entry point
│   ├── index.html              # HTML shell with SEO & OpenGraph tags
│   ├── vercel.json             # Vercel SPA routing rewrite config
│   ├── vite.config.ts          # Code-splitting & build configuration
│   └── package.json
│
├── server/                     # Backend Application (Node.js + Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma       # Database schema & models
│   ├── src/
│   │   ├── config/             # Prisma client instance
│   │   ├── controllers/        # Dashboard, Bookings, Mechanics, Customers
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Business logic & query aggregation
│   │   ├── utils/              # SSE emitter, ApiError, ApiResponse, asyncHandler
│   │   ├── seed.ts             # 500+ realistic bookings seed generator
│   │   └── server.ts           # Express server entry point
│   ├── .env.example            # Backend environment template
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🧪 Testing API Endpoints

You can verify the backend endpoints directly using `curl` or Postman:

```bash
# 1. Health check
curl http://localhost:5000/health

# 2. Get today's dashboard overview metrics
curl http://localhost:5000/api/v1/dashboard?period=today

# 3. Query bookings with filters & pagination
curl "http://localhost:5000/api/v1/bookings?page=1&limit=10&status=pending&sortBy=date&sortOrder=desc"

# 4. Fetch single booking by ID
curl http://localhost:5000/api/v1/bookings/YOUR_BOOKING_ID

# 5. Update a booking status (triggers live SSE broadcast)
curl -X PATCH http://localhost:5000/api/v1/bookings/YOUR_BOOKING_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress","notes":"Technician started engine inspection"}'

# 6. List mechanics with search filter
curl "http://localhost:5000/api/v1/mechanics?status=available&search=John"
```

---

## 🚀 Production Deployment

### Frontend (Vercel)
1. Import the repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add environment variable:
   - `VITE_API_URL`: `https://instant-mechanic.onrender.com/api/v1`
5. Deploy. `vercel.json` and `_redirects` will automatically handle SPA client-side routing.

### Backend (Render)
1. Create a **Web Service** in [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. **Build Command**: `npm install && npx prisma generate && npm run build`
4. **Start Command**: `npm start`
5. Add environment variables:
   - `DATABASE_URL`: Your hosted PostgreSQL connection string
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FRONTEND_URL`: `https://client-theta-liard-65.vercel.app`

---

## 🤖 AI Usage & Engineering Process

### 🛠️ AI Tools Utilized
- **Claude / Antigravity AI**: Architecture design, API route scaffolding, and edge-case debugging.
- **GitHub Copilot**: Autocompleting repetitive TypeScript interfaces and Tailwind utility classes.

### 🎯 What AI Was Used For
- Scaffolding the initial Express controller/service layer patterns and error handling boilerplate.
- Brainstorming realistic seed data generation strategies for 500+ mock bookings, customers, and vehicles.
- Generating base chart configurations in Recharts.

### ⚙️ What Was Personally Designed, Built & Refined
- **Real-Time SSE Engine**: Architected the Server-Sent Events subscriber pool (`utils/sse.ts`), event emission triggers upon booking status changes, and React Query cache invalidation hook (`useSSE.ts`).
- **Interactive Details Modals**: Built the **Booking Details Modal** (customer contact cards, vehicle specs, service duration, and real-time status transitions) and **Mechanic Details Modal** (live beacon indicators, rating, active jobs, and quick status changer).
- **Notification Drawer**: Designed the interactive header notification center with live unread counts, recent bookings feed, and click-outside dismissal.
- **Design System & Color Palette**: Tailored the high-contrast light/dark status badge palette (`Emerald`, `Blue`, `Amber`, `Cyan`, `Violet`, `Rose`) with animated pulsing beacon dots.
- **Production Build & SPA Routing**: Optimized Vite chunking (reducing bundle size by >70% with manual chunk splitting) and configured `vercel.json` and `_redirects` for zero-404 client routing.

---

## 📄 License

This project was built for the **Instant Mechanic Full Stack Developer** assignment.

<p align="center">
  Built by <strong>Shivam</strong>
</p>
