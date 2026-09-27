# Ceyflow website + admin ERP

Public marketing site (home, systems, pricing, about, contact) plus a staff-only
admin area (dashboard, clients, quotations, invoices with payments, website
inquiries, settings) built with Next.js 15 (App Router), React 19, Tailwind v4
and Node's built-in SQLite (`node:sqlite`) — no external database needed.

## Run it locally

```bash
npm install
cp .env.example .env.local   # set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

The database file is created automatically at `data/ceyflow.db` on first run,
seeded with the four systems and three bundles from the Ceyflow service
catalog, and one admin user (from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, default
`admin@ceyflow.lk` / `ceyflow123`).

Admin area: `/admin` (redirects to `/admin/login`). Package and bundle prices
are editable under Settings — public pages show "Get a quotation" until a
price is set.

## Structure

- `app/(site)/` — public marketing pages
- `app/admin/login/` — staff login (outside the auth-gated layout)
- `app/admin/(app)/` — everything behind login: dashboard, clients, quotes,
  invoices, inquiries, settings
- `lib/db.ts` — schema, seed data loader, typed query helpers
- `lib/actions.ts` — all server actions (auth, CRUD, quote→invoice conversion, payments)
- `components/admin/DocumentForm.tsx` / `DocumentView.tsx` — the quotation/invoice
  editor and the printable view (also used for invoices' payment tracking)
