import "server-only";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { SEED_PACKAGES, SEED_BUNDLES, SEED_SETTINGS } from "./seed-data";

// node:sqlite is built into Node 22+. Loaded through require so the bundler leaves it alone.
const req = createRequire(import.meta.url);
const { DatabaseSync } = req("node:sqlite") as typeof import("node:sqlite");

type DB = InstanceType<typeof DatabaseSync>;

const globalForDb = globalThis as unknown as { __ceyflowDb?: DB };

function open(): DB {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "ceyflow.db"));
  // Next's build (page-data collection) opens this module from several worker
  // processes at once; a busy timeout lets them queue for the write lock
  // instead of failing immediately with SQLITE_BUSY.
  db.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  migrate(db);
  seed(db);
  return db;
}

export const db: DB = globalForDb.__ceyflowDb ?? (globalForDb.__ceyflowDb = open());

// node:sqlite rows come back as [Object: null prototype], which React's
// Server → Client Component serialization rejects ("Classes or null
// prototypes are not supported"). Every row that might reach a "use client"
// component as a prop goes through this to become a plain object first.
function plain<T extends object>(row: T): T;
function plain<T extends object>(row: T | undefined): T | undefined;
function plain<T extends object>(row: T | undefined): T | undefined {
  return row ? ({ ...row } as T) : row;
}
function plainAll<T extends object>(rows: T[]): T[] {
  return rows.map((r) => ({ ...r }));
}

function migrate(db: DB) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, tagline TEXT NOT NULL,
      solves TEXT NOT NULL, best_for TEXT NOT NULL, description TEXT NOT NULL,
      features TEXT NOT NULL, timeline TEXT NOT NULL, note TEXT NOT NULL DEFAULT '',
      setup_fee REAL, monthly_fee REAL, sort INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS bundles (
      id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, includes TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
      setup_fee REAL, monthly_fee REAL, highlight INTEGER NOT NULL DEFAULT 0, sort INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '', interest TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new', client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY, type TEXT NOT NULL CHECK (type IN ('quote','invoice')), number TEXT UNIQUE NOT NULL,
      client_id INTEGER NOT NULL REFERENCES clients(id), issue_date TEXT NOT NULL, due_date TEXT,
      status TEXT NOT NULL, title TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', terms TEXT NOT NULL DEFAULT '',
      discount REAL NOT NULL DEFAULT 0, tax_rate REAL NOT NULL DEFAULT 0,
      source_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS document_items (
      id INTEGER PRIMARY KEY, document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      description TEXT NOT NULL, qty REAL NOT NULL DEFAULT 1, unit_price REAL NOT NULL DEFAULT 0, sort INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY, document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      amount REAL NOT NULL, date TEXT NOT NULL, method TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT ''
    );
  `);
}

// Several build-time (and dev-time hot-reload) workers can open this module
// at once, so seeding must tolerate racing inserts rather than assume it's
// the only writer — hence "OR IGNORE" everywhere instead of a has()-then-insert check.
function seed(db: DB) {
  const ins = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(SEED_SETTINGS)) ins.run(k, v);

  const insPkg = db.prepare(
    `INSERT OR IGNORE INTO packages (slug, name, tagline, solves, best_for, description, features, timeline, note, setup_fee, monthly_fee, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  SEED_PACKAGES.forEach((p, i) =>
    insPkg.run(p.slug, p.name, p.tagline, p.solves, p.bestFor, p.description, JSON.stringify(p.features), p.timeline, p.note, null, null, i)
  );

  const insBundle = db.prepare("INSERT OR IGNORE INTO bundles (name, includes, description, highlight, sort) VALUES (?, ?, ?, ?, ?)");
  SEED_BUNDLES.forEach((b, i) => insBundle.run(b.name, b.includes, b.description, b.highlight ? 1 : 0, i));

  const hasUsers = (db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number }).n > 0;
  if (!hasUsers) {
    const email = process.env.ADMIN_EMAIL || "admin@ceyflow.lk";
    const password = process.env.ADMIN_PASSWORD || "ceyflow123";
    db.prepare("INSERT OR IGNORE INTO users (email, name, password_hash) VALUES (?, ?, ?)").run(
      email.toLowerCase(),
      "Vihanga Sudaraka",
      bcrypt.hashSync(password, 10)
    );
  }
}

/* ---------- typed helpers ---------- */

export type Settings = Record<string, string>;
export function getSettings(): Settings {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
export function setSetting(key: string, value: string) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}

export type Package = {
  id: number; slug: string; name: string; tagline: string; solves: string; best_for: string;
  description: string; features: string[]; timeline: string; note: string;
  setup_fee: number | null; monthly_fee: number | null; sort: number; active: number;
};
export function getPackages(onlyActive = true): Package[] {
  const rows = db.prepare(`SELECT * FROM packages ${onlyActive ? "WHERE active = 1" : ""} ORDER BY sort, id`).all() as any[];
  return rows.map((r) => ({ ...r, features: JSON.parse(r.features) }));
}

export type Bundle = {
  id: number; name: string; includes: string; description: string;
  setup_fee: number | null; monthly_fee: number | null; highlight: number; sort: number;
};
export function getBundles(): Bundle[] {
  return plainAll(db.prepare("SELECT * FROM bundles ORDER BY sort, id").all() as Bundle[]);
}

export type Client = {
  id: number; name: string; company: string; email: string; phone: string; address: string; notes: string; created_at: string;
};
export function getClients(): Client[] {
  return plainAll(db.prepare("SELECT * FROM clients ORDER BY name COLLATE NOCASE").all() as Client[]);
}
export function getClient(id: number): Client | undefined {
  return plain(db.prepare("SELECT * FROM clients WHERE id = ?").get(id) as Client | undefined);
}

export type Inquiry = {
  id: number; name: string; company: string; email: string; phone: string; interest: string;
  message: string; status: string; client_id: number | null; created_at: string;
};
export function getInquiries(): Inquiry[] {
  return plainAll(db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC, id DESC").all() as Inquiry[]);
}

export type DocType = "quote" | "invoice";
export type DocItem = { id?: number; description: string; qty: number; unit_price: number };
export type Doc = {
  id: number; type: DocType; number: string; client_id: number; issue_date: string; due_date: string | null;
  status: string; title: string; notes: string; terms: string; discount: number; tax_rate: number;
  source_id: number | null; created_at: string; updated_at: string;
};
export type DocWithTotals = Doc & {
  client_name: string; client_company: string; subtotal: number; total: number; paid: number; balance: number;
};

export function totals(items: DocItem[], discount: number, taxRate: number) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = afterDiscount * (taxRate / 100);
  return { subtotal, tax, total: afterDiscount + tax };
}

export function getItems(docId: number): DocItem[] {
  return plainAll(
    db.prepare("SELECT id, description, qty, unit_price FROM document_items WHERE document_id = ? ORDER BY sort, id").all(docId) as DocItem[]
  );
}

function withTotals(d: Doc & { client_name: string; client_company: string }): DocWithTotals {
  const t = totals(getItems(d.id), d.discount, d.tax_rate);
  const paid = (db.prepare("SELECT COALESCE(SUM(amount), 0) AS p FROM payments WHERE document_id = ?").get(d.id) as { p: number }).p;
  return { ...d, subtotal: t.subtotal, total: t.total, paid, balance: t.total - paid };
}

export function getDocuments(type?: DocType, clientId?: number): DocWithTotals[] {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (type) { where.push("d.type = ?"); args.push(type); }
  if (clientId) { where.push("d.client_id = ?"); args.push(clientId); }
  const rows = db.prepare(
    `SELECT d.*, c.name AS client_name, c.company AS client_company FROM documents d
     JOIN clients c ON c.id = d.client_id ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY d.issue_date DESC, d.id DESC`
  ).all(...args) as any[];
  return rows.map(withTotals);
}

export function getDocument(id: number): DocWithTotals | undefined {
  const row = db.prepare(
    `SELECT d.*, c.name AS client_name, c.company AS client_company FROM documents d
     JOIN clients c ON c.id = d.client_id WHERE d.id = ?`
  ).get(id) as any;
  return row ? withTotals(row) : undefined;
}

export type Payment = { id: number; document_id: number; amount: number; date: string; method: string; note: string };
export function getPayments(docId: number): Payment[] {
  return plainAll(db.prepare("SELECT * FROM payments WHERE document_id = ? ORDER BY date, id").all(docId) as Payment[]);
}

export function nextNumber(type: DocType): string {
  const s = getSettings();
  const prefix = type === "invoice" ? s.invoice_prefix || "INV-" : s.quote_prefix || "QT-";
  const year = new Date().getFullYear();
  const base = `${prefix}${year}-`;
  const rows = db.prepare("SELECT number FROM documents WHERE type = ? AND number LIKE ?").all(type, `${base}%`) as { number: string }[];
  const max = rows.reduce((m, r) => Math.max(m, parseInt(r.number.slice(base.length), 10) || 0), 0);
  return `${base}${String(max + 1).padStart(4, "0")}`;
}
