"use client";
import { useMemo, useState } from "react";
import type { Client, DocType, DocWithTotals, DocItem, DocInput } from "../../lib/adminData";
import { money, QUOTE_STATUSES, INVOICE_STATUSES, today } from "../../lib/format";

type Props = {
  type: DocType;
  clients: Client[];
  doc?: DocWithTotals;
  items?: DocItem[];
  defaultClientId?: number;
  defaultTerms: string;
  currency: string;
  onSave: (input: DocInput) => Promise<{ error?: string; id?: number }>;
};

let seq = 0;
function newRow(it?: DocItem) {
  return { key: `row-${++seq}`, description: it?.description || "", qty: it?.qty ?? 1, unit_price: it?.unit_price ?? 0 };
}

export function DocumentForm({ type, clients, doc, items, defaultClientId, defaultTerms, currency, onSave }: Props) {
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [rows, setRows] = useState(() => (items && items.length ? items.map((i) => newRow(i)) : [newRow()]));
  const [discount, setDiscount] = useState(doc?.discount ?? 0);
  const [taxRate, setTaxRate] = useState(doc?.tax_rate ?? 0);
  const statuses = type === "quote" ? QUOTE_STATUSES : INVOICE_STATUSES;

  const subtotal = useMemo(() => rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.unit_price) || 0), 0), [rows]);
  const afterDiscount = Math.max(0, subtotal - (Number(discount) || 0));
  const tax = afterDiscount * ((Number(taxRate) || 0) / 100);
  const total = afterDiscount + tax;

  function update(key: string, patch: Partial<{ description: string; qty: number; unit_price: number }>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(undefined);
    const result = await onSave({
      id: doc?.id,
      client_id: Number(fd.get("client_id")),
      issue_date: String(fd.get("issue_date") || today()),
      due_date: String(fd.get("due_date") || "") || null,
      status: String(fd.get("status") || "draft"),
      title: String(fd.get("title") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
      terms: String(fd.get("terms") || "").trim(),
      discount: Number(discount) || 0,
      tax_rate: Number(taxRate) || 0,
      items: rows.map((r) => ({ description: r.description.trim(), qty: Number(r.qty) || 0, unit_price: Number(r.unit_price) || 0 })).filter((i) => i.description),
    });
    setPending(false);
    if (result.error) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="label">Client *</label>
          <select name="client_id" defaultValue={doc?.client_id ?? defaultClientId ?? ""} required className="input">
            <option value="" disabled>Choose a client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>)}
          </select>
        </div>
        <div><label className="label">Issue date</label><input type="date" name="issue_date" defaultValue={doc?.issue_date ?? today()} className="input" /></div>
        <div><label className="label">{type === "invoice" ? "Due date" : "Valid until"}</label><input type="date" name="due_date" defaultValue={doc?.due_date ?? ""} className="input" /></div>
        <div className="sm:col-span-2"><label className="label">Title / reference</label><input name="title" defaultValue={doc?.title} placeholder="e.g. Order Management setup" className="input" /></div>
        <div>
          <label className="label">Status</label>
          <select name="status" defaultValue={doc?.status ?? "draft"} className="input capitalize">
            {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
      </div>

      <div className="card p-6">
        <p className="mb-3 font-semibold">Line items</p>
        <div className="space-y-2">
          <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-semibold text-slate-500 uppercase sm:grid">
            <span className="col-span-6">Description</span><span className="col-span-2">Qty</span><span className="col-span-2">Unit price</span><span className="col-span-2 text-right">Amount</span>
          </div>
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-12 items-start gap-2">
              <input
                defaultValue={r.description} placeholder="Item description"
                onChange={(e) => update(r.key, { description: e.target.value })}
                className="input col-span-12 sm:col-span-6"
              />
              <input
                type="number" step="any" defaultValue={r.qty}
                onChange={(e) => update(r.key, { qty: Number(e.target.value) })}
                className="input col-span-4 sm:col-span-2"
              />
              <input
                type="number" step="any" defaultValue={r.unit_price}
                onChange={(e) => update(r.key, { unit_price: Number(e.target.value) })}
                className="input col-span-5 sm:col-span-2"
              />
              <div className="col-span-2 flex items-center justify-end gap-2 pt-2 text-sm text-slate-600 sm:col-span-2">
                <span className="hidden sm:inline">{money((Number(r.qty) || 0) * (Number(r.unit_price) || 0), currency)}</span>
                <button type="button" onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.key !== r.key) : rs))} className="text-slate-400 hover:text-red-600" aria-label="Remove row">✕</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setRows((rs) => [...rs, newRow()])} className="btn-secondary btn-sm mt-3">+ Add line</button>

        <div className="mt-6 flex flex-col items-end gap-2 border-t border-slate-100 pt-4">
          <div className="flex w-full max-w-xs items-center justify-between gap-3 text-sm">
            <span className="text-slate-500">Subtotal</span><span>{money(subtotal, currency)}</span>
          </div>
          <div className="flex w-full max-w-xs items-center justify-between gap-3 text-sm">
            <label htmlFor="discount" className="text-slate-500">Discount ({currency})</label>
            <input id="discount" name="discount" type="number" step="any" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="input w-28 text-right" />
          </div>
          <div className="flex w-full max-w-xs items-center justify-between gap-3 text-sm">
            <label htmlFor="tax_rate" className="text-slate-500">Tax (%)</label>
            <input id="tax_rate" name="tax_rate" type="number" step="any" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="input w-28 text-right" />
          </div>
          <div className="flex w-full max-w-xs items-center justify-between border-t border-slate-100 pt-2 text-base font-bold">
            <span>Total</span><span>{money(total, currency)}</span>
          </div>
        </div>
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <div><label className="label">Notes (shown on the document)</label><textarea name="notes" defaultValue={doc?.notes} rows={3} className="input" /></div>
        <div><label className="label">Terms</label><textarea name="terms" defaultValue={doc?.terms ?? defaultTerms} rows={3} className="input" /></div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button className="btn-primary" disabled={pending} type="submit">{pending ? "Saving..." : doc ? "Save changes" : `Create ${type}`}</button>
      </div>
    </form>
  );
}
