# Ceyflow website + admin ERP

Public marketing site (home, systems, pricing, about, contact) plus a staff-only
admin area (dashboard, clients, quotations, invoices with payments, website
inquiries, settings) built with Next.js 15 (App Router), React 19 and Tailwind v4,
exported as a static site and backed by Supabase (Postgres + Auth).

## One-time Supabase setup

1. Create a project at supabase.com.
2. Open the SQL Editor and run `supabase/schema.sql` — it creates the tables,
   seeds the four systems / three bundles / company settings, and sets up row
   level security (public read on pricing content, staff-only on everything else,
   public insert-only on the contact form's inquiries).
3. Authentication → Users → Add user — create the staff login (email + password,
   with "Auto Confirm User" checked). That's the only "admin account"; there's no
   separate users table.
4. Settings → API — copy the Project URL and the `anon` public key.

## Run it locally

```bash
npm install
cp .env.example .env.local   # paste in the Supabase URL + anon key
npm run dev                  # http://localhost:3000
```

`npm run build` produces a static export in `out/`; `npm run preview` serves that
folder locally so you can check the exact build that ships to GitHub Pages.

Admin area: `/admin` (redirects to `/admin/login`). Package and bundle prices
are editable under Settings — public pages show "Get a quotation" until a
price is set, and pick up a price change on the visitor's next page load
(no rebuild needed, since pricing is read from Supabase at runtime).

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. It needs two repository secrets (Settings → Secrets and
variables → Actions): `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Enable Pages under Settings → Pages, source
"GitHub Actions". If the site isn't on a custom domain and isn't a
`<org>.github.io` root repo, also add a `NEXT_PUBLIC_BASE_PATH` secret set to
`/<repo-name>`.

## Structure

- `app/(site)/` — public marketing pages; dynamic content (pricing, packages,
  settings) is fetched client-side from Supabase via the hooks in `lib/publicData.ts`,
  with the site's own seed content shown instantly as a fallback while that loads.
- `app/admin/login/` — staff login (Supabase Auth), outside the auth-gated layout
- `app/admin/(app)/` — everything behind login: dashboard, clients, quotes,
  invoices, inquiries, settings. Detail/edit pages use a `?id=` query param
  rather than a `[id]` route segment, since a static export can't serve
  arbitrary IDs created after deploy.
- `lib/supabaseClient.ts` — the browser Supabase client
- `lib/authClient.ts` — sign in/out, password change, the `useSession()` hook
- `lib/adminData.ts` — all staff-side reads/writes (clients, quotes, invoices,
  payments, inquiries, pricing) — enforced server-side by the RLS policies in
  `supabase/schema.sql`, not just by hiding the UI
- `components/admin/DocumentForm.tsx` / `DocumentView.tsx` — the quotation/invoice
  editor and the printable view (also used for invoices' payment tracking)
