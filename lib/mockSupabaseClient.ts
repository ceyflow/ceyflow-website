// In-memory stand-in for the Supabase client, used only on /demo/* routes so
// prospects can click through a fully working admin without a real login or
// touching real client data. Implements just the chainable subset of the
// supabase-js query builder that lib/adminData.ts, lib/publicData.ts and the
// settings page actually call — see lib/supabaseClient.ts for how it's swapped in.
import { SEED_PACKAGES, SEED_BUNDLES, SEED_SETTINGS } from "./seed-data";

type Row = Record<string, any>;
type Table = Row[];

const db: Record<string, Table> = {
  clients: [],
  inquiries: [],
  documents: [],
  document_items: [],
  payments: [],
  settings: Object.entries(SEED_SETTINGS).map(([key, value]) => ({ key, value })),
  packages: SEED_PACKAGES.map((p, i) => ({
    id: i + 1, slug: p.slug, name: p.name, tagline: p.tagline, solves: p.solves, best_for: p.bestFor,
    description: p.description, features: p.features, timeline: p.timeline, note: p.note,
    setup_fee: null, monthly_fee: null, sort: i, active: true,
  })),
  bundles: SEED_BUNDLES.map((b, i) => ({
    id: i + 1, name: b.name, includes: b.includes, description: b.description,
    setup_fee: null, monthly_fee: null, highlight: b.highlight, sort: i,
  })),
};

const nextId: Record<string, number> = { clients: 1, inquiries: 1, documents: 1, document_items: 1, payments: 1 };

function ilikeMatch(value: string, pattern: string): boolean {
  const re = new RegExp("^" + pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*") + "$", "i");
  return re.test(value ?? "");
}

class MockQueryBuilder {
  private table: string;
  private op: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private filters: [string, any][] = [];
  private inFilter: [string, any[]] | null = null;
  private ilikeFilter: [string, string] | null = null;
  private orders: [string, boolean][] = [];
  private singleMode: "maybe" | "strict" | null = null;
  private selectCols = "*";
  private rowsToWrite: Row[] = [];
  private upsertConflictCol: string | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(cols?: string) {
    this.selectCols = cols || "*";
    return this;
  }
  eq(col: string, val: any) {
    this.filters.push([col, val]);
    return this;
  }
  in(col: string, vals: any[]) {
    this.inFilter = [col, vals];
    return this;
  }
  ilike(col: string, pattern: string) {
    this.ilikeFilter = [col, pattern];
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orders.push([col, opts?.ascending !== false]);
    return this;
  }
  maybeSingle() {
    this.singleMode = "maybe";
    return this;
  }
  single() {
    this.singleMode = "strict";
    return this;
  }
  insert(rows: Row | Row[]) {
    this.op = "insert";
    this.rowsToWrite = Array.isArray(rows) ? rows : [rows];
    return this;
  }
  update(fields: Row) {
    this.op = "update";
    this.rowsToWrite = [fields];
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  upsert(rows: Row | Row[], opts?: { onConflict?: string }) {
    this.op = "upsert";
    this.rowsToWrite = Array.isArray(rows) ? rows : [rows];
    this.upsertConflictCol = opts?.onConflict || "id";
    return this;
  }

  // Makes the builder itself awaitable, like supabase-js's PostgrestBuilder.
  then(resolve: (v: { data: any; error: any }) => void, reject?: (e: any) => void) {
    try {
      resolve(this.exec());
    } catch (e) {
      if (reject) reject(e);
      else resolve({ data: null, error: { message: String(e) } });
    }
  }

  private matches(row: Row): boolean {
    if (this.filters.some(([col, val]) => row[col] !== val)) return false;
    if (this.inFilter && !this.inFilter[1].includes(row[this.inFilter[0]])) return false;
    if (this.ilikeFilter && !ilikeMatch(row[this.ilikeFilter[0]], this.ilikeFilter[1])) return false;
    return true;
  }

  private sorted(rows: Row[]): Row[] {
    if (this.orders.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const [col, asc] of this.orders) {
        if (a[col] === b[col]) continue;
        const gt = a[col] > b[col];
        return asc ? (gt ? 1 : -1) : gt ? -1 : 1;
      }
      return 0;
    });
  }

  private withEmbeds(rows: Row[]): Row[] {
    if (this.table !== "documents" || !this.selectCols.includes("clients(")) return rows;
    return rows.map((r) => {
      const c = db.clients.find((cl) => cl.id === r.client_id);
      return { ...r, client: c ? { name: c.name, company: c.company } : null };
    });
  }

  private exec(): { data: any; error: any } {
    const table = db[this.table] || (db[this.table] = []);

    if (this.op === "insert") {
      const inserted = this.rowsToWrite.map((row) => {
        const withId: Row = { ...row };
        if (!("id" in withId) && nextId[this.table] !== undefined) withId.id = nextId[this.table]++;
        if (!("created_at" in withId)) withId.created_at = new Date().toISOString();
        if (this.table === "documents" && !("updated_at" in withId)) withId.updated_at = withId.created_at;
        table.push(withId);
        return withId;
      });
      if (this.singleMode) return { data: inserted[0] || null, error: null };
      return { data: inserted, error: null };
    }

    if (this.op === "update") {
      const fields = this.rowsToWrite[0];
      table.forEach((row) => {
        if (this.matches(row)) Object.assign(row, fields);
      });
      return { data: null, error: null };
    }

    if (this.op === "delete") {
      for (let i = table.length - 1; i >= 0; i--) {
        if (this.matches(table[i])) table.splice(i, 1);
      }
      return { data: null, error: null };
    }

    if (this.op === "upsert") {
      const conflictCol = this.upsertConflictCol!;
      this.rowsToWrite.forEach((row) => {
        const existing = table.find((r) => r[conflictCol] === row[conflictCol]);
        if (existing) Object.assign(existing, row);
        else table.push({ ...row });
      });
      return { data: null, error: null };
    }

    // select
    let rows = table.filter((r) => this.matches(r));
    rows = this.sorted(rows);
    rows = this.withEmbeds(rows);
    if (this.singleMode === "maybe") return { data: rows[0] ? { ...rows[0] } : null, error: null };
    if (this.singleMode === "strict") {
      return rows[0] ? { data: { ...rows[0] }, error: null } : { data: null, error: { message: "No rows found" } };
    }
    return { data: rows.map((r) => ({ ...r })), error: null };
  }
}

const FAKE_SESSION = { user: { email: "demo@ceyflow.lk", user_metadata: { name: "Demo Account" } } } as any;

export const mockSupabase = {
  from(table: string) {
    return new MockQueryBuilder(table);
  },
  auth: {
    getSession: async () => ({ data: { session: FAKE_SESSION }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: async () => ({ data: {}, error: null }),
    updateUser: async () => ({ data: {}, error: { message: "Password changes aren't available in the demo." } }),
    signOut: async () => ({ error: null }),
  },
} as any;
