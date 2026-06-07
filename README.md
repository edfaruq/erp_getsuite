# ERP GetSuite

A modular ERP system built with Next.js 14. It covers three core business modules designed for parallel development by a three-person team.

## Modules

| Module | Description | Owner |
|--------|-------------|-------|
| **Order to Cash (OTC)** | Sales orders, approvals, fulfillment, invoicing, customer payments | Chandra |
| **Procure to Pay (PTP)** | Purchase orders, receiving, vendor bills, approvals, bill payments | Farhan |
| **Item Management** | Item master, inventory adjustments, transfers, reports | Faruq |

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- **Database** — MySQL (Laragon) + Prisma ORM
- **State** — Zustand (active role switcher)
- **Forms** — React Hook Form + Zod

## Role Switcher

No login required. Use the **role dropdown** in the navbar or sidebar to switch between 8 roles instantly:

Sales Rep, Sales Manager, Inventory Manager, A/R Analyst, Purchasing Manager, A/P Analyst, Accounting Manager, CEO/CFO.

Sidebar, dashboard, reminder portlet, and menus update per active role. State is stored in Zustand (`src/store/role.store.ts`).

## Roles & Access

| Role | Key Actions |
|------|-------------|
| Sales Representative | Create sales orders |
| Sales Manager | Approve/reject sales orders |
| Inventory Manager | Pick, pack, ship; receive POs; adjust/transfer inventory |
| A/R Analyst | Invoice orders, accept payments, A/R reports |
| Purchasing Manager | Create POs, manage vendors, item master |
| A/P Analyst | Bill POs, 3-way match, pay bills, standalone bills |
| Accounting Manager | Approve standalone bills |
| CEO/CFO | Item strategy, reporting strategy |

Menu visibility per role is defined in `src/constants/roleMenus.ts`.

## Project Structure

```
erp-getsuite/
├── prisma/                  # Database schema & seed (Faruq)
├── public/
└── src/
    ├── app/
    │   ├── (dashboard)/     # Main layout & module routes
    │   │   ├── otc/         # Chandra
    │   │   ├── ptp/         # Farhan
    │   │   └── inventory/   # Faruq
    │   └── api/             # Module-scoped API routes
    ├── components/
    │   ├── shared/          # Sidebar, Navbar, RoleSwitcher, etc. (Faruq)
    │   ├── otc/             # Chandra
    │   ├── ptp/             # Farhan
    │   └── inventory/       # Faruq
    ├── constants/           # Roles, statuses, role menus (Faruq)
    ├── hooks/               # Per-module React hooks
    ├── lib/                 # Prisma, utils (Faruq)
    ├── store/               # Zustand stores (per module + role)
    └── types/               # Shared & module TypeScript types
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for folder ownership rules and Git workflow.

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL (included with [Laragon](https://laragon.org))
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd erp-getsuite

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Laragon → Start All (MySQL must be running)
# Create database in HeidiSQL or MySQL CLI:
#   CREATE DATABASE erp_getsuite;

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed sample data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the role dropdown in the navbar to explore as different roles.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string (e.g. `mysql://root:@localhost:3306/erp_getsuite`) |

See `.env.example` for the full template.

## Business Process Flows

### Order to Cash

```
DRAFT → PENDING_APPROVAL → APPROVED/REJECTED → PICKING → PACKING → SHIPPED → INVOICED → PAID
```

### Procure to Pay

```
DRAFT → PENDING_RECEIPT → PARTIALLY_RECEIVED → RECEIVED → BILLED → PAID
```

Status enums and helpers live in `src/constants/status.ts`.

## Team Workflow

1. Pull latest `main` before starting work
2. Pakai branch nama kamu: `chandra`, `farhan`, atau `faruq`
3. Work only inside your assigned folders
4. Push branch and open a Pull Request — **never push directly to `main`**
5. Shared file changes require review from all three members

Full details: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db seed` | Seed database with sample data |

## License

Private — internal team project.
