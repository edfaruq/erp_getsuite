# Contributing Guide

This project is developed by a team of three contributors working in parallel on separate modules. Follow these rules to avoid merge conflicts and keep the codebase maintainable.

## Team Ownership

| Member   | Module / Area | Responsibility |
|----------|---------------|----------------|
| Chandra  | Order to Cash (OTC) | Sales Representative, Sales Manager, A/R Analyst workflows |
| Farhan   | Procure to Pay (PTP) | Purchasing Manager, A/P Analyst, Accounting Manager workflows |
| Faruq    | Inventory, Shared, System | Inventory Manager, CEO/CFO, role switcher, shared UI, database |

### Actor → Owner Mapping

**Chandra (OTC)**
- Sales Representative → Create Sales Order
- Sales Manager → Approve/Reject Sales Order
- A/R Analyst → Invoice Sales Order, Accept Customer Payment, A/R Aging Report, KPI Dashboard

**Farhan (PTP)**
- Purchasing Manager → Create Purchase Order, Manage Vendor Master
- Accounting Manager → Approve Standalone Bill
- A/P Analyst → Bill PO, 3-Way Match, Pay Bill, Enter Standalone Bill, A/P Aging Report, KPI Dashboard

**Faruq (Operations & Integration)**
- Inventory Manager → Pick/Pack/Ship (OTC), Receive PO (PTP), Adjust/Transfer Inventory, Physical Inventory Worksheet, KPI Dashboard
- CEO/CFO → Define Item Strategy, Define Reporting Strategy
- Purchasing/Admin → Manage Item Master (Inventory, Non-Inventory, Service items)
- System → Main Dashboard, Role Switcher, Shared Item Master, Reminder Portlet

---

## Folder Ownership Rules

### Chandra — commit ONLY to:

```
src/app/(dashboard)/sales-orders/
src/app/(dashboard)/approvals/
src/app/(dashboard)/pick/  pack/  ship/
src/app/(dashboard)/invoices/
src/app/(dashboard)/customer-payments/
src/app/(dashboard)/ar-aging/  ar-kpi/
src/app/api/otc/
src/components/otc/
src/hooks/otc/
src/store/otc.store.ts
src/types/otc.types.ts
```

### Farhan — commit ONLY to:

```
src/app/(dashboard)/purchase-orders/
src/app/(dashboard)/receive/  vendors/  bills/
src/app/(dashboard)/bill-payments/  bill-approvals/
src/app/(dashboard)/ap-aging/  ap-kpi/
src/app/api/ptp/
src/components/ptp/
src/hooks/ptp/
src/store/ptp.store.ts
src/types/ptp.types.ts
```

### Faruq — commit ONLY to:

```
src/app/(dashboard)/items/  adjust/  transfer/
src/app/(dashboard)/item-strategy/  reporting-strategy/
src/app/(dashboard)/physical-worksheet/  inventory-kpi/
src/app/(dashboard)/sales-by-items/  purchase-by-items/  analyze-inventory/
src/app/(dashboard)/page.tsx   # shell dashboard
src/constants/routes.ts
src/app/api/inventory/
src/components/inventory/
src/hooks/inventory/
src/store/inventory.store.ts
src/types/inventory.types.ts
src/components/shared/
src/store/role.store.ts
src/constants/
src/lib/
prisma/
```

---

## Dashboard — Satu Halaman

Ada **hanya 1 dashboard** di `/`. Isinya berubah otomatis sesuai role aktif:

| Bagian | File | Owner |
|--------|------|-------|
| Hero + Quick Access | `src/app/(dashboard)/page.tsx` | Faruq |
| Tasks / reminders | `src/components/shared/ReminderPortlet.tsx` | Faruq |

Task list di `ReminderPortlet` ambil data real dari API. Kalau perlu tambah reminder baru untuk role tertentu, koordinasi dengan Faruq (shared file).

**Jangan** buat route dashboard terpisah (`/otc/dashboard`, dll).

### Shared Files (Faruq manages)

The following are owned by Faruq and **must not be modified** by Chandra or Farhan without coordination and a PR reviewed by all three members:

- `src/components/shared/` — Sidebar, Navbar, RoleSwitcher, ReminderPortlet, DataTable, etc.
- `src/store/role.store.ts`
- `src/constants/` — roles, status, roleMenus
- `src/lib/` — prisma, utils, actor resolver
- `prisma/schema.prisma` and `prisma/seed.ts`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/page.tsx`
- `src/middleware.ts`

If you need a schema change, type update, or shared component change, open an issue or Slack/message Faruq first. Do not edit these files directly on your feature branch.

---

## Branch Naming

Satu branch per anggota tim — pakai **nama kalian saja**:

| Branch | Owner |
|--------|-------|
| `chandra` | Chandra — semua kerjaan OTC |
| `farhan` | Farhan — semua kerjaan PTP |
| `faruq` | Faruq — Inventory, shared, system |

Tidak perlu buat branch baru tiap fitur. Kerjakan semua commit di branch nama masing-masing, lalu buka PR ke `main`.

---

## Git Workflow

1. **Before starting work** — sync dengan main:
   ```bash
   git checkout main
   git pull origin main
   git checkout chandra   # atau farhan / faruq
   git pull origin chandra
   git merge main         # pastikan up to date dengan main
   ```

2. **Pertama kali** — buat branch nama kamu (sekali saja):
   ```bash
   git checkout -b chandra   # ganti dengan nama kamu
   git push -u origin chandra
   ```

3. **While working** — commit hanya di folder yang kamu miliki (lihat atas).

4. **After finishing** — push dan buka PR:
   ```bash
   git push origin chandra   # ganti dengan nama kamu
   ```
   Then open a Pull Request on GitHub. **Never push directly to `main`.**

4. **Shared file changes** — require PR review and approval from **all three** team members before merge.

5. **Conflict resolution** — if you hit conflicts in shared files, coordinate with Faruq. Do not resolve shared-file conflicts unilaterally.

---

## Code Conventions

- **TypeScript** — strict mode; no `any` unless unavoidable and commented.
- **Components** — place module-specific components in `src/components/[module]/`; shared UI in `src/components/shared/`.
- **API routes** — one module per folder under `src/app/api/[module]/`.
- **State** — Zustand stores per module (`otc.store.ts`, `ptp.store.ts`, `inventory.store.ts`); active role in `role.store.ts` only.
- **Forms** — React Hook Form + Zod validation.
- **Styling** — Tailwind CSS + shadcn/ui; match existing patterns in shared components.

---

## Status Flows (Do Not Skip Steps)

### Order to Cash (OTC)

```
DRAFT → PENDING_APPROVAL → APPROVED / REJECTED → PICKING → PACKING → SHIPPED → INVOICED → PAID
```

### Procure to Pay (PTP)

```
DRAFT → PENDING_RECEIPT → PARTIALLY_RECEIVED → RECEIVED → BILLED → PAID
```

Enforce these transitions in API routes and UI actions. Do not allow jumping statuses.

---

## Role Switcher

No login — ganti role lewat dropdown di navbar/sidebar. State role di Zustand (`role.store.ts`).

- Jangan rusak sidebar filtering saat menambah halaman baru.
- Halaman baru → update `src/constants/roleMenus.ts` (koordinasi Faruq atau shared PR).
- Test fitur di setiap role yang relevan sebelum buka PR.

---

## Pull Request Checklist

- [ ] Changes are only in folders you own (or shared PR with full team review)
- [ ] Branch is up to date with `main`
- [ ] No direct commits to `main`
- [ ] New pages added to `roleMenus.ts` if role-gated (via shared PR)
- [ ] Status transitions follow OTC/PTP flows
- [ ] TypeScript compiles without errors
- [ ] Tested under relevant roles via role switcher

---

## Questions?

- **Schema / shared UI / role switcher** → Faruq
- **OTC flows** → Chandra
- **PTP flows** → Farhan
