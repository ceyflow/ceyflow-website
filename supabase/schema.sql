-- Ceyflow: run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- after creating a new Supabase project, before the site is deployed.

create table if not exists public.settings (
  key text primary key,
  value text not null
);

create table if not exists public.packages (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  tagline text not null,
  solves text not null,
  best_for text not null,
  description text not null,
  features jsonb not null default '[]',
  timeline text not null,
  note text not null default '',
  setup_fee double precision,
  monthly_fee double precision,
  sort integer not null default 0,
  active boolean not null default true
);

create table if not exists public.bundles (
  id bigint generated always as identity primary key,
  name text unique not null,
  includes text not null,
  description text not null default '',
  setup_fee double precision,
  monthly_fee double precision,
  highlight boolean not null default false,
  sort integer not null default 0
);

create table if not exists public.clients (
  id bigint generated always as identity primary key,
  name text not null,
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  interest text not null default '',
  message text not null default '',
  status text not null default 'new',
  client_id bigint references public.clients(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id bigint generated always as identity primary key,
  type text not null check (type in ('quote', 'invoice')),
  number text unique not null,
  client_id bigint not null references public.clients(id),
  issue_date date not null,
  due_date date,
  status text not null,
  title text not null default '',
  notes text not null default '',
  terms text not null default '',
  discount double precision not null default 0,
  tax_rate double precision not null default 0,
  source_id bigint references public.documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_items (
  id bigint generated always as identity primary key,
  document_id bigint not null references public.documents(id) on delete cascade,
  description text not null,
  qty double precision not null default 1,
  unit_price double precision not null default 0,
  sort integer not null default 0
);

create table if not exists public.payments (
  id bigint generated always as identity primary key,
  document_id bigint not null references public.documents(id) on delete cascade,
  amount double precision not null,
  date date not null,
  method text not null default '',
  note text not null default ''
);

-- ---------- starting content (same catalog the site shipped with) ----------

insert into public.settings (key, value) values
  ('company_name', 'Ceyflow'),
  ('company_tagline', 'Business operations systems for growing Sri Lankan brands'),
  ('company_email', 'hello.ceyflow@gmail.com'),
  ('company_phone', '+94 70 134 0255'),
  ('company_whatsapp', '94701340255'),
  ('company_address', 'Colombo, Sri Lanka'),
  ('bank_details', E'Bank: [Your bank]\nAccount name: Ceyflow\nAccount no: [0000 0000 0000]\nBranch: [Branch]'),
  ('currency', 'LKR'),
  ('invoice_prefix', 'INV-'),
  ('quote_prefix', 'QT-'),
  ('default_tax_rate', '0'),
  ('quote_terms', 'This quotation is valid for 30 days. 50% of the setup fee is due to start work, the balance on go-live. Monthly fees are billed in advance.'),
  ('invoice_terms', 'Payment is due within 14 days. Please use the invoice number as the payment reference.')
on conflict (key) do nothing;

insert into public.packages (slug, name, tagline, solves, best_for, description, features, timeline, note, sort) values
  ('order-management', 'Order Management', 'Every order on one shared board, from received to delivered.',
   'Orders lost in chats and notebooks', 'Any business taking orders by phone, Facebook or WhatsApp',
   'One shared board where every order moves from received to delivered, so nothing is lost and anyone on the team can see its status. Built for online sellers and small brands taking 20 to 500 orders a month, usually with 2 to 15 staff.',
   '["Orders board with your own stages","New order form, full order history, invoice numbering, printable invoices and labels","Customer records with order history and an inquiry page for staff taking calls","Complaints log with categories, priorities, assignment and status","Customer ratings with a review link sent after delivery","Dashboard of recent orders and progress, CSV export","Staff logins with role-based page access, team chat and your branding"]',
   '2 to 4 weeks, including one round of changes after your team starts using it.', '', 0),
  ('delivery-tracking', 'Delivery Tracking', 'Customers track their parcel on your website, not by calling you.',
   'Customers calling to ask where their parcel is', 'Businesses shipping COD parcels by courier',
   'Customers see live courier status on your own website, which cuts "where is my order?" calls. Built for businesses sending cash-on-delivery parcels through Sri Lankan couriers.',
   '["Public \"Track your order\" page on your domain","Live courier timeline pulled from the courier''s API","Staff enter the tracking number once, in the order","Fallback link to the courier''s own site","Courier API keys stored securely on the server"]',
   '1 to 2 weeks per courier. Works with Order Management or your existing order list.',
   'Optional: create courier pickups, print waybills and receive push status updates.', 1),
  ('sms-automation', 'SMS Automation', 'The right text at the right moment, without typing a thing.',
   'Manual texting and no repeat-customer marketing', 'Businesses with a customer phone list',
   'Customers get a text at the moments that matter, and you can send promotions to your whole list without anyone typing messages by hand.',
   '["Automatic SMS when an order reaches a chosen stage","Manual \"Send SMS\" button on each order, with confirmation","Editable message templates with order details filled in","Bulk SMS campaigns with recipient lists and campaign history","Works with local SMS gateways such as send.lk"]',
   'About 1 week. Works best with Order Management.', 'SMS credits are billed by the gateway and paid directly by you.', 2),
  ('inventory-production', 'Inventory and Production', 'Run the factory floor from a screen instead of paper sheets.',
   'Batches, recipes and QC tracked on paper', 'Small manufacturers: cosmetics, food, herbal and cleaning products',
   'Every production batch is planned from a recipe, tracked step by step through quality checks, and signed off. Ideal for manufacturers working toward GMP compliance.',
   '["Recipe library with raw material amounts scaled to batch size","Batch numbers, printable batch sheets and staff signatures","Production board with your own stages and QC checkpoints","Step timers with alerts for timed processes","GMP checklists and task templates","Supplier records"]',
   '3 to 5 weeks, mostly spent mapping your recipes and QC steps.', '', 3)
on conflict (slug) do nothing;

insert into public.bundles (name, includes, description, highlight, sort) values
  ('Starter', 'Order Management + SMS Automation', 'Get every order organised and keep customers informed automatically.', false, 0),
  ('Growth', 'Starter + Delivery Tracking', 'Cut status calls with live courier tracking on your own website.', true, 1),
  ('Full Operations', 'All four systems', 'Orders, delivery, SMS and production in one place — a complete operations platform.', false, 2)
on conflict (name) do nothing;

-- ---------- row level security ----------

alter table public.settings enable row level security;
alter table public.packages enable row level security;
alter table public.bundles enable row level security;
alter table public.clients enable row level security;
alter table public.inquiries enable row level security;
alter table public.documents enable row level security;
alter table public.document_items enable row level security;
alter table public.payments enable row level security;

-- Public marketing content: anyone can read, only signed-in staff can edit.
create policy "settings_read" on public.settings for select to anon, authenticated using (true);
create policy "settings_write" on public.settings for all to authenticated using (true) with check (true);

create policy "packages_read" on public.packages for select to anon, authenticated using (true);
create policy "packages_write" on public.packages for all to authenticated using (true) with check (true);

create policy "bundles_read" on public.bundles for select to anon, authenticated using (true);
create policy "bundles_write" on public.bundles for all to authenticated using (true) with check (true);

-- Business data: staff only, never exposed to anonymous visitors.
create policy "clients_staff_only" on public.clients for all to authenticated using (true) with check (true);
create policy "documents_staff_only" on public.documents for all to authenticated using (true) with check (true);
create policy "document_items_staff_only" on public.document_items for all to authenticated using (true) with check (true);
create policy "payments_staff_only" on public.payments for all to authenticated using (true) with check (true);

-- Inquiries: anyone can submit the public contact form, but only staff can read or manage them.
create policy "inquiries_public_insert" on public.inquiries for insert to anon, authenticated with check (true);
create policy "inquiries_staff_read" on public.inquiries for select to authenticated using (true);
create policy "inquiries_staff_update" on public.inquiries for update to authenticated using (true) with check (true);
create policy "inquiries_staff_delete" on public.inquiries for delete to authenticated using (true);

-- ---------- first admin login ----------
-- Create the staff account in Supabase Studio → Authentication → Users → Add user
-- (email + password, "Auto Confirm User" checked). That account can then sign in
-- at /admin/login — there's no separate "admin table", Supabase Auth is the login.
