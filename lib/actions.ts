"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db, nextNumber, type DocType, getSettings, setSetting } from "./db";
import { startSession, endSession, requireAdmin, getSession } from "./auth";
import { today } from "./format";

/* ---------- auth ---------- */

export type LoginState = { error?: string };
export async function login(_: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | { id: number; email: string; name: string; password_hash: string }
    | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return { error: "Incorrect email or password." };
  }
  await startSession({ uid: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export type PasswordState = { error?: string; ok?: boolean };
export async function changePassword(_: PasswordState, fd: FormData): Promise<PasswordState> {
  const session = await requireAdmin();
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.uid) as { password_hash: string };
  if (!bcrypt.compareSync(current, user.password_hash)) return { error: "Current password is incorrect." };
  if (next.length < 6) return { error: "New password must be at least 6 characters." };
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(bcrypt.hashSync(next, 10), session.uid);
  return { ok: true };
}

/* ---------- clients ---------- */

export type ClientState = { error?: string; ok?: boolean };

export async function saveClient(_: ClientState, fd: FormData): Promise<ClientState> {
  await requireAdmin();
  const id = fd.get("id") ? Number(fd.get("id")) : null;
  const vals = ["name", "company", "email", "phone", "address", "notes"].map((k) => String(fd.get(k) || "").trim());
  if (!vals[0]) return { error: "Client name is required." };
  if (id) {
    db.prepare("UPDATE clients SET name=?, company=?, email=?, phone=?, address=?, notes=? WHERE id=?").run(...vals, id);
  } else {
    const info = db
      .prepare("INSERT INTO clients (name, company, email, phone, address, notes) VALUES (?, ?, ?, ?, ?, ?)")
      .run(...vals);
    revalidatePath("/admin/clients");
    redirect(`/admin/clients/${info.lastInsertRowid}`);
  }
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  return { ok: true };
}

export async function deleteClient(id: number) {
  await requireAdmin();
  db.prepare("DELETE FROM clients WHERE id = ?").run(id);
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

/* ---------- inquiries ---------- */

export async function setInquiryStatus(id: number, status: string) {
  await requireAdmin();
  db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin/inquiries");
}

export async function convertInquiry(id: number) {
  await requireAdmin();
  const inq = db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id) as any;
  if (!inq) return;
  const info = db
    .prepare("INSERT INTO clients (name, company, email, phone, notes) VALUES (?, ?, ?, ?, ?)")
    .run(inq.name, inq.company, inq.email, inq.phone, inq.message ? `From website inquiry: ${inq.message}` : "");
  db.prepare("UPDATE inquiries SET client_id = ?, status = 'converted' WHERE id = ?").run(info.lastInsertRowid, id);
  revalidatePath("/admin/inquiries");
  redirect(`/admin/clients/${info.lastInsertRowid}`);
}

/* ---------- documents (quotes + invoices) ---------- */

type ItemInput = { description: string; qty: number; unit_price: number };

function parseItems(fd: FormData): ItemInput[] {
  const desc = fd.getAll("item_description") as string[];
  const qty = fd.getAll("item_qty") as string[];
  const price = fd.getAll("item_price") as string[];
  const items: ItemInput[] = [];
  for (let i = 0; i < desc.length; i++) {
    const description = (desc[i] || "").trim();
    if (!description) continue;
    items.push({ description, qty: Number(qty[i]) || 0, unit_price: Number(price[i]) || 0 });
  }
  return items;
}

export type DocState = { error?: string };

export async function saveDocument(type: DocType, _: DocState, fd: FormData): Promise<DocState> {
  await requireAdmin();
  const id = fd.get("id") ? Number(fd.get("id")) : null;
  const clientId = Number(fd.get("client_id"));
  if (!clientId) return { error: "Please choose a client." };
  const items = parseItems(fd);
  if (items.length === 0) return { error: "Add at least one line item." };

  const fields = {
    client_id: clientId,
    issue_date: String(fd.get("issue_date") || today()),
    due_date: String(fd.get("due_date") || "") || null,
    status: String(fd.get("status") || "draft"),
    title: String(fd.get("title") || "").trim(),
    notes: String(fd.get("notes") || "").trim(),
    terms: String(fd.get("terms") || "").trim(),
    discount: Number(fd.get("discount")) || 0,
    tax_rate: Number(fd.get("tax_rate")) || 0,
  };

  let docId: number;
  if (id) {
    db.prepare(
      `UPDATE documents SET client_id=?, issue_date=?, due_date=?, status=?, title=?, notes=?, terms=?, discount=?, tax_rate=?, updated_at=datetime('now') WHERE id=?`
    ).run(fields.client_id, fields.issue_date, fields.due_date, fields.status, fields.title, fields.notes, fields.terms, fields.discount, fields.tax_rate, id);
    db.prepare("DELETE FROM document_items WHERE document_id = ?").run(id);
    docId = id;
  } else {
    const number = nextNumber(type);
    const info = db.prepare(
      `INSERT INTO documents (type, number, client_id, issue_date, due_date, status, title, notes, terms, discount, tax_rate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(type, number, fields.client_id, fields.issue_date, fields.due_date, fields.status, fields.title, fields.notes, fields.terms, fields.discount, fields.tax_rate);
    docId = Number(info.lastInsertRowid);
  }

  const insItem = db.prepare("INSERT INTO document_items (document_id, description, qty, unit_price, sort) VALUES (?, ?, ?, ?, ?)");
  items.forEach((it, i) => insItem.run(docId, it.description, it.qty, it.unit_price, i));

  revalidatePath(`/admin/${type}s`);
  redirect(`/admin/${type}s/${docId}`);
}

export async function deleteDocument(type: DocType, id: number) {
  await requireAdmin();
  db.prepare("DELETE FROM documents WHERE id = ?").run(id);
  revalidatePath(`/admin/${type}s`);
  redirect(`/admin/${type}s`);
}

export async function setDocumentStatus(type: DocType, id: number, status: string) {
  await requireAdmin();
  db.prepare("UPDATE documents SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  revalidatePath(`/admin/${type}s/${id}`);
  revalidatePath(`/admin/${type}s`);
}

export async function convertQuoteToInvoice(quoteId: number) {
  await requireAdmin();
  const q = db.prepare("SELECT * FROM documents WHERE id = ? AND type = 'quote'").get(quoteId) as any;
  if (!q) return;
  const items = db.prepare("SELECT description, qty, unit_price FROM document_items WHERE document_id = ?").all(quoteId) as ItemInput[];
  const number = nextNumber("invoice");
  const info = db.prepare(
    `INSERT INTO documents (type, number, client_id, issue_date, due_date, status, title, notes, terms, discount, tax_rate, source_id)
     VALUES ('invoice', ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)`
  ).run(number, q.client_id, today(), null, q.title, q.notes, getSettings().invoice_terms || "", q.discount, q.tax_rate, quoteId);
  const invoiceId = Number(info.lastInsertRowid);
  const ins = db.prepare("INSERT INTO document_items (document_id, description, qty, unit_price, sort) VALUES (?, ?, ?, ?, ?)");
  items.forEach((it, i) => ins.run(invoiceId, it.description, it.qty, it.unit_price, i));
  db.prepare("UPDATE documents SET status = 'accepted' WHERE id = ?").run(quoteId);
  revalidatePath("/admin/quotes");
  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoiceId}`);
}

export async function addPayment(documentId: number, fd: FormData) {
  await requireAdmin();
  const amount = Number(fd.get("amount"));
  if (!amount || amount <= 0) return;
  db.prepare("INSERT INTO payments (document_id, amount, date, method, note) VALUES (?, ?, ?, ?, ?)").run(
    documentId, amount, String(fd.get("date") || today()), String(fd.get("method") || ""), String(fd.get("note") || "")
  );
  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(documentId) as any;
  const items = db.prepare("SELECT qty, unit_price FROM document_items WHERE document_id = ?").all(documentId) as { qty: number; unit_price: number }[];
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  const total = Math.max(0, subtotal - doc.discount) * (1 + doc.tax_rate / 100);
  const paid = (db.prepare("SELECT COALESCE(SUM(amount),0) AS p FROM payments WHERE document_id = ?").get(documentId) as { p: number }).p;
  const status = paid >= total - 0.01 ? "paid" : paid > 0 ? "partially paid" : doc.status;
  db.prepare("UPDATE documents SET status = ? WHERE id = ?").run(status, documentId);
  revalidatePath(`/admin/invoices/${documentId}`);
}

export async function deletePayment(documentId: number, paymentId: number) {
  await requireAdmin();
  db.prepare("DELETE FROM payments WHERE id = ? AND document_id = ?").run(paymentId, documentId);
  revalidatePath(`/admin/invoices/${documentId}`);
}

/* ---------- settings & packages ---------- */

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  for (const [k, v] of fd.entries()) setSetting(k, String(v));
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function savePackagePricing(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const setup = fd.get("setup_fee") ? Number(fd.get("setup_fee")) : null;
  const monthly = fd.get("monthly_fee") ? Number(fd.get("monthly_fee")) : null;
  db.prepare("UPDATE packages SET setup_fee = ?, monthly_fee = ? WHERE id = ?").run(setup, monthly, id);
  revalidatePath("/admin/settings");
  revalidatePath("/pricing");
}

export async function saveBundlePricing(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const setup = fd.get("setup_fee") ? Number(fd.get("setup_fee")) : null;
  const monthly = fd.get("monthly_fee") ? Number(fd.get("monthly_fee")) : null;
  db.prepare("UPDATE bundles SET setup_fee = ?, monthly_fee = ? WHERE id = ?").run(setup, monthly, id);
  revalidatePath("/admin/settings");
  revalidatePath("/pricing");
}

export { getSession };
