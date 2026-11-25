# Ceyflow projects registry

Single list of everything Ceyflow runs. **Names and public IDs only: never put keys, passwords or
tokens here** (this repo is public).

## Naming rules

| Thing | Pattern | Example |
|---|---|---|
| GitHub repo (in the `ceyflow` org) | `<client>-<product>` | `audrey-care-ops` |
| Supabase project (in "ceyflow's Org") | `<Client> Project` (add the product if a client has more than one database) | `Audrey Care Project` |
| Domain | the client's own, registered in the client's name | `audreyops.online` |
| Template repo (not built yet) | `ceyflow-core` | |

`<product>` is `ops` (internal operations app), `shop` (online shop) or `site` (brochure site).

## Live projects

| Client | Product | GitHub repo | Supabase project (ref) | Hosting | Status |
|---|---|---|---|---|---|
| Ceyflow | Marketing site + admin ERP | `ceyflow/ceyflow-website` | `Ceyflow Company` (`hqmkdzcfoljalaridxxv`) | GitHub Pages | Live |
| Audrey Care | Operations app | `ceyflow/audrey-care-ops` | `Audrey Care Project` (`mntnobzwbvqpvmaxqcuc`) | GitHub Pages, `audreyops.online` | **Live, in daily use** |
| Audrey Care | Online shop | `ceyflow/audrey-care-shop` | not created yet (demo mode) | not deployed | In progress |

Supabase project names: "Audrey Care Project" (audreyops) and "Ceyflow Company" (the Ceyflow site's database).
To rename one: Project Settings → General → Project name. Renaming only changes the label; the project ref, URL
and keys stay the same, so nothing breaks.

**Deadline:** Supabase shows "Projects will be restricted from 17 Dec, 2026 if your organization remains over
quota". Fix before then: find the exceeded limit under Organization → Usage, then either reduce it or upgrade to Pro.

## Free-tier rules (until the org is upgraded to Pro)

- A free Supabase org allows **2 active projects**, and free projects **pause after about a week with no activity**.
  audreyops stays awake because staff use it daily. Free projects have **no automatic backups**: take a manual
  export before any risky change and once a week (`supabase db dump -f backup.sql`, then keep the file somewhere private).
- Because both slots are used, the next client with a database needs either the Pro upgrade or a static
  site with no database (see below).
- **Static client sites with no database** (brochure sites, landing pages) cost nothing: host on Cloudflare Pages
  or GitHub Pages. Send the contact form to the `inquiries` table in `ceyflow-internal` and add the client's name
  in the message, so one project covers many small sites.

## Adding a new client: checklist

1. Create the repo `<client>-<product>` in the `ceyflow` org (private for anything with client data).
2. Decide if it needs its own database. If yes: new Supabase project `<client>-<product>-prod`, run its `schema.sql`, create the staff login.
3. Domain registered in the client's name; DNS managed by Ceyflow.
4. Host on Cloudflare Pages (works with private repos for free) or GitHub Pages.
5. Add a row to the table above.
6. Write down in the agreement: who owns the data, who pays for hosting, and how the client gets an export if they leave.

## To do (when budget allows)

- Upgrade "ceyflow's Org" to Supabase Pro: backups, no pausing, leaked-password protection, room for more projects.
- Make the audrey repos private and move their hosting to Cloudflare Pages.
- Extract `ceyflow-core`, a template repo with the shared admin, orders, SMS and tracking modules.
