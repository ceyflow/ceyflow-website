"use client";
import { supabase } from "./supabaseClient";
import { today } from "./format";

/* ---------- types ---------- */

export type Client = {
  id: number; name: string; company: string; email: string; phone: string; address: string; notes: string; created_at: string;
};

export type Inquiry = {
  id: number; name: string; company: string; email: string; phone: string; interest: string;
  message: string; status: string; client_id: number | null; created_at: string;
};

export type DocType = "quote" | "invoice";
export type DocItem = { id?: number; description: string; qty: number; unit_price: number };
export type Doc = {
  id: number; type: DocType; number: string; client_id: number; issue_date: string; due_date: string | null;
  status: string; title: string; notes: string; terms: string; discount: number; tax_rate: number;
  source_id: number | null; created_at: string; updated_at: string;
};
export type DocWithTotals = Doc & {
  client_name: string; client_company: string; client_phone: string; subtotal: number; total: number; paid: number; balance: number;
};
export type Payment = { id: number; document_id: number; amount: number; date: string; method: string; note: string };

export function totals(items: { qty: number; unit_price: number }[], discount: number, taxRate: number) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = afterDiscount * (taxRate / 100);
  return { subtotal, tax, total: afterDiscount + tax };
}

function withTotals(
  d: Doc & { client: { name: string; company: string; phone: string } | null },
  items: (DocItem & { document_id: number })[],
  payments: { document_id: number; amount: number }[]
): DocWithTotals {
  const myItems = items.filter((i) => i.document_id === d.id);
  const t = totals(myItems, d.discount, d.tax_rate);
  const paid = payments.filter((p) => p.document_id === d.id).reduce((s, p) => s + p.amount, 0);
  const { client, ...rest } = d;
  return {
    ...rest, client_name: client?.name || "", client_company: client?.company || "", client_phone: client?.phone || "",
    subtotal: t.subtotal, total: t.total, paid, balance: t.total - paid,
  };
}

/* ---------- clients ---------- */

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase.from("clients").select("*").order("name");
  if (error) throw error;
  return data as Client[];
}
export async function getClient(id: number): Promise<Client | undefined> {
  const { data } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  return (data as Client) || undefined;
}
export async function saveClient(input: Partial<Client> & { name: string }): Promise<{ error?: string; id?: number }> {
  if (!input.name.trim()) return { error: "Client name is required." };
  const fields = {
    name: input.name.trim(), company: input.company || "", email: input.email || "",
    phone: input.phone || "", address: input.address || "", notes: input.notes || "",
  };
  if (input.id) {
    const { error } = await supabase.from("clients").update(fields).eq("id", input.id);
    if (error) return { error: error.message };
    return { id: input.id };
  }
  const { data, error } = await supabase.from("clients").insert(fields).select("id").single();
  if (error) return { error: error.message };
  return { id: data.id };
}
export async function deleteClient(id: number) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- inquiries ---------- */

export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }).order("id", { ascending: false });
  if (error) throw error;
  return data as Inquiry[];
}
export async function setInquiryStatus(id: number, status: string) {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}
export async function convertInquiry(id: number): Promise<number | null> {
  const { data: inq } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!inq) return null;
  const { data: client, error } = await supabase.from("clients").insert({
    name: inq.name, company: inq.company, email: inq.email, phone: inq.phone,
    notes: inq.message ? `From website inquiry: ${inq.message}` : "",
  }).select("id").single();
  if (error) throw error;
  await supabase.from("inquiries").update({ client_id: client.id, status: "converted" }).eq("id", id);
  return client.id as number;
}
export async function submitInquiry(input: { name: string; company: string; email: string; phone: string; interest: string; message: string }): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  if (!name) return { ok: false, error: "Please tell us your name." };
  if (!email && !phone) return { ok: false, error: "Please give us an email or phone number so we can reply." };
  const { error } = await supabase.from("inquiries").insert({
    name, company: input.company.trim(), email, phone, interest: input.interest.trim(), message: input.message.trim(),
  });
  if (error) return { ok: false, error: "Something went wrong sending your message. Please try again." };
  return { ok: true };
}

/* ---------- documents (quotes + invoices) ---------- */

export async function getItems(docId: number): Promise<DocItem[]> {
  const { data, error } = await supabase.from("document_items").select("id, description, qty, unit_price").eq("document_id", docId).order("sort").order("id");
  if (error) throw error;
  return data as DocItem[];
}
export async function getPayments(docId: number): Promise<Payment[]> {
  const { data, error } = await supabase.from("payments").select("*").eq("document_id", docId).order("date").order("id");
  if (error) throw error;
  return data as Payment[];
}
export async function getDocuments(type?: DocType, clientId?: number): Promise<DocWithTotals[]> {
  let q = supabase.from("documents").select("*, client:clients(name, company, phone)").order("issue_date", { ascending: false }).order("id", { ascending: false });
  if (type) q = q.eq("type", type);
  if (clientId) q = q.eq("client_id", clientId);
  const { data: docs, error } = await q;
  if (error) throw error;
  if (!docs || docs.length === 0) return [];
  const ids = (docs as any[]).map((d) => d.id);
  const [{ data: items }, { data: payments }] = await Promise.all([
    supabase.from("document_items").select("*").in("document_id", ids),
    supabase.from("payments").select("document_id, amount").in("document_id", ids),
  ]);
  return (docs as any[]).map((d) => withTotals(d, (items as any[]) || [], (payments as any[]) || []));
}
export async function getDocument(id: number): Promise<DocWithTotals | undefined> {
  const { data: d } = await supabase.from("documents").select("*, client:clients(name, company, phone)").eq("id", id).maybeSingle();
  if (!d) return undefined;
  const [items, payments] = await Promise.all([getItems(id), getPayments(id)]);
  return withTotals(d as any, items.map((i) => ({ ...i, document_id: id })), payments.map((p) => ({ document_id: id, amount: p.amount })));
}

async function nextNumber(type: DocType, settings: Record<string, string>): Promise<string> {
  const prefix = type === "invoice" ? settings.invoice_prefix || "INV-" : settings.quote_prefix || "QT-";
  const year = new Date().getFullYear();
  const base = `${prefix}${year}-`;
  const { data } = await supabase.from("documents").select("number").eq("type", type).ilike("number", `${base}%`);
  const max = (data || []).reduce((m, r: any) => Math.max(m, parseInt(String(r.number).slice(base.length), 10) || 0), 0);
  return `${base}${String(max + 1).padStart(4, "0")}`;
}

export type DocInput = {
  id?: number; client_id: number; issue_date: string; due_date: string | null; status: string;
  title: string; notes: string; terms: string; discount: number; tax_rate: number; items: DocItem[];
};
export async function saveDocument(type: DocType, input: DocInput, settings: Record<string, string>): Promise<{ error?: string; id?: number }> {
  if (!input.client_id) return { error: "Please choose a client." };
  if (input.items.length === 0) return { error: "Add at least one line item." };
  const fields = {
    client_id: input.client_id, issue_date: input.issue_date || today(), due_date: input.due_date || null,
    status: input.status || "draft", title: input.title.trim(), notes: input.notes.trim(), terms: input.terms.trim(),
    discount: input.discount || 0, tax_rate: input.tax_rate || 0,
  };
  let docId: number;
  if (input.id) {
    const { error } = await supabase.from("documents").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", input.id);
    if (error) return { error: error.message };
    await supabase.from("document_items").delete().eq("document_id", input.id);
    docId = input.id;
  } else {
    const number = await nextNumber(type, settings);
    const { data, error } = await supabase.from("documents").insert({ type, number, ...fields }).select("id").single();
    if (error) return { error: error.message };
    docId = data.id;
  }
  const rows = input.items.map((it, i) => ({ document_id: docId, description: it.description, qty: it.qty, unit_price: it.unit_price, sort: i }));
  const { error: itemsError } = await supabase.from("document_items").insert(rows);
  if (itemsError) return { error: itemsError.message };
  return { id: docId };
}
export async function deleteDocument(id: number) {
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
}
export async function setDocumentStatus(id: number, status: string) {
  const { error } = await supabase.from("documents").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}
export async function convertQuoteToInvoice(quoteId: number, settings: Record<string, string>): Promise<number | null> {
  const { data: q } = await supabase.from("documents").select("*").eq("id", quoteId).eq("type", "quote").maybeSingle();
  if (!q) return null;
  const items = await getItems(quoteId);
  const number = await nextNumber("invoice", settings);
  const { data: inv, error } = await supabase.from("documents").insert({
    type: "invoice", number, client_id: q.client_id, issue_date: today(), due_date: null, status: "draft",
    title: q.title, notes: q.notes, terms: settings.invoice_terms || "", discount: q.discount, tax_rate: q.tax_rate, source_id: quoteId,
  }).select("id").single();
  if (error) throw error;
  const invoiceId = inv.id as number;
  await supabase.from("document_items").insert(items.map((it, i) => ({ document_id: invoiceId, description: it.description, qty: it.qty, unit_price: it.unit_price, sort: i })));
  await supabase.from("documents").update({ status: "accepted" }).eq("id", quoteId);
  return invoiceId;
}

/* ---------- payments ---------- */

export async function addPayment(documentId: number, input: { amount: number; date: string; method: string; note: string }) {
  if (!input.amount || input.amount <= 0) return;
  await supabase.from("payments").insert({
    document_id: documentId, amount: input.amount, date: input.date || today(), method: input.method || "", note: input.note || "",
  });
  const { data: doc } = await supabase.from("documents").select("discount, tax_rate, status").eq("id", documentId).single();
  if (!doc) return;
  const items = await getItems(documentId);
  const t = totals(items, doc.discount, doc.tax_rate);
  const payments = await getPayments(documentId);
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  const status = paid >= t.total - 0.01 ? "paid" : paid > 0 ? "partially paid" : doc.status;
  await supabase.from("documents").update({ status }).eq("id", documentId);
}
export async function deletePayment(documentId: number, paymentId: number) {
  await supabase.from("payments").delete().eq("id", paymentId).eq("document_id", documentId);
}

/* ---------- settings & pricing (admin side of lib/publicData.ts's tables) ---------- */

export async function saveSettings(entries: Record<string, string>) {
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value }));
  const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;
}
export async function savePackagePricing(id: number, setup_fee: number | null, monthly_fee: number | null) {
  const { error } = await supabase.from("packages").update({ setup_fee, monthly_fee }).eq("id", id);
  if (error) throw error;
}
export async function saveBundlePricing(id: number, setup_fee: number | null, monthly_fee: number | null) {
  const { error } = await supabase.from("bundles").update({ setup_fee, monthly_fee }).eq("id", id);
  if (error) throw error;
}
