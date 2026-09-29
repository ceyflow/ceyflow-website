"use client";
import Link from "next/link";
import type { Client, DocItem, DocType, DocWithTotals, Payment } from "../../lib/adminData";
import type { Settings } from "../../lib/publicData";
import { money, date, displayStatus, digitsOnly, QUOTE_STATUSES, INVOICE_STATUSES } from "../../lib/format";
import { Badge } from "./Badge";
import { PrintButton } from "./PrintButton";
import { StatusSelect } from "./StatusSelect";
import { StatusStepper } from "./StatusStepper";
import { adminBase } from "../../lib/adminBase";

function whatsAppShareHref(doc: DocWithTotals, client: Client, settings: Settings, label: string) {
  const cur = settings.currency || "LKR";
  const lines = [`${label} ${doc.number}`, `Client: ${client.name}`, `Total: ${money(doc.total, cur)}`];
  if (doc.type === "invoice" && doc.balance > 0) lines.push(`Balance due: ${money(doc.balance, cur)}`);
  if (settings.company_name) lines.push(`— ${settings.company_name}`);
  const phone = client.phone ? digitsOnly(client.phone) : "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function DocumentView({
  type, doc, items, client, settings, payments, onStatusChange, onConvert, onDelete, onAddPayment, onDeletePayment,
}: {
  type: DocType; doc: DocWithTotals; items: DocItem[]; client: Client; settings: Settings; payments?: Payment[];
  onStatusChange: (status: string) => void;
  onConvert?: () => void;
  onDelete: () => void;
  onAddPayment?: (input: { amount: number; date: string; method: string; note: string }) => void;
  onDeletePayment?: (paymentId: number) => void;
}) {
  const cur = settings.currency || "LKR";
  const statuses = type === "quote" ? QUOTE_STATUSES : INVOICE_STATUSES;
  const label = type === "quote" ? "Quotation" : "Invoice";
  const logoAlign = settings.invoice_logo_align === "right" || settings.invoice_logo_align === "center" ? settings.invoice_logo_align : "left";
  const logoAlignClass = logoAlign === "center" ? "mx-auto" : logoAlign === "right" ? "ml-auto" : "";
  const showNotes = settings.invoice_show_notes !== "false";
  const showTerms = settings.invoice_show_terms !== "false";
  const showPaymentDetails = settings.invoice_show_payment_details !== "false";

  const showStepper = !["void", "declined", "expired"].includes(doc.status);

  return (
    <div className="space-y-6">
      <div className="no-print space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href={`${adminBase()}/${type}s`} className="text-slate-400 hover:text-slate-700">←</Link>
            <h1 className="font-display text-2xl font-bold">{doc.number}</h1>
            <Badge value={displayStatus(doc)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusSelect
              action={(fd) => onStatusChange(String(fd.get("status")))}
              defaultValue={doc.status}
              options={statuses}
              className="input py-1.5 text-sm capitalize"
            />
            {type === "quote" && doc.status !== "declined" && (
              <button onClick={onConvert} className="btn-secondary">Convert to invoice</button>
            )}
            <Link href={`${adminBase()}/${type}s/edit?id=${doc.id}`} className="btn-secondary">Edit</Link>
            <a
              href={whatsAppShareHref(doc, client, settings, label)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Share via WhatsApp
            </a>
            <PrintButton />
            <button onClick={onDelete} className="btn-danger">Delete</button>
          </div>
        </div>
        {showStepper && <StatusStepper type={type} status={doc.status} />}
      </div>

      <div className="print-sheet card mx-auto max-w-3xl p-8 md:p-12">
        <div
          className={
            logoAlign === "center"
              ? "flex flex-col items-center gap-4 border-b border-slate-100 pb-6 text-center"
              : `flex flex-wrap items-start justify-between gap-6 border-b border-slate-100 pb-6 ${logoAlign === "right" ? "flex-row-reverse" : ""}`
          }
        >
          <div className={logoAlign === "right" ? "text-right" : undefined}>
            {settings.logo_light_bg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo_light_bg} alt={settings.company_name || "Logo"} className={`mb-2 h-10 w-auto object-contain ${logoAlignClass}`} />
            )}
            <p className="font-display text-xl font-extrabold text-brand-800">{settings.company_name}</p>
            <p className="mt-1 text-sm text-slate-500">{settings.company_address}</p>
            <p className="text-sm text-slate-500">{settings.company_email} · {settings.company_phone}</p>
          </div>
          <div className={logoAlign === "center" ? "" : logoAlign === "right" ? "text-left" : "text-right"}>
            <p className="font-display text-2xl font-bold uppercase tracking-wide text-slate-800">{label}</p>
            <p className="mt-1 text-sm text-slate-500">{doc.number}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Billed to</p>
            <p className="mt-1 font-semibold">{client.name}</p>
            {client.company && <p className="text-sm text-slate-600">{client.company}</p>}
            {client.address && <p className="text-sm text-slate-600">{client.address}</p>}
            <p className="text-sm text-slate-600">{[client.email, client.phone].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="text-sm sm:text-right">
            <p><span className="text-slate-500">Issue date:</span> {date(doc.issue_date)}</p>
            {doc.due_date && <p><span className="text-slate-500">{type === "invoice" ? "Due date" : "Valid until"}:</span> {date(doc.due_date)}</p>}
            {doc.title && <p className="mt-1 font-medium">{doc.title}</p>}
          </div>
        </div>

        <table className="table mt-8">
          <thead><tr><th>Description</th><th className="text-right">Qty</th><th className="text-right">Unit price</th><th className="text-right">Amount</th></tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.description}</td>
                <td className="text-right">{it.qty}</td>
                <td className="text-right">{money(it.unit_price, cur)}</td>
                <td className="text-right">{money(it.qty * it.unit_price, cur)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col items-end gap-1 text-sm">
          <div className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Subtotal</span><span>{money(doc.subtotal, cur)}</span></div>
          {doc.discount > 0 && <div className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Discount</span><span>-{money(doc.discount, cur)}</span></div>}
          {doc.tax_rate > 0 && <div className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Tax ({doc.tax_rate}%)</span><span>{money(doc.total - Math.max(0, doc.subtotal - doc.discount), cur)}</span></div>}
          <div className="flex w-full max-w-xs justify-between border-t border-slate-200 pt-1.5 text-base font-bold"><span>Total</span><span>{money(doc.total, cur)}</span></div>
          {type === "invoice" && (
            <>
              <div className="flex w-full max-w-xs justify-between text-emerald-700"><span>Paid</span><span>{money(doc.paid, cur)}</span></div>
              <div className="flex w-full max-w-xs justify-between font-bold text-amber-700"><span>Balance due</span><span>{money(doc.balance, cur)}</span></div>
            </>
          )}
        </div>

        {showNotes && doc.notes && <p className="mt-8 text-sm text-slate-600">{doc.notes}</p>}
        {showTerms && doc.terms && (
          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p className="mb-1 font-semibold text-slate-600">Terms</p>
            <p className="whitespace-pre-line">{doc.terms}</p>
          </div>
        )}
        {type === "invoice" && showPaymentDetails && settings.bank_details && (
          <div className="mt-4 text-xs whitespace-pre-line text-slate-500">
            <p className="mb-1 font-semibold text-slate-600">Payment details</p>
            {settings.bank_details}
          </div>
        )}
      </div>

      {type === "invoice" && payments && (
        <div className="no-print card mx-auto max-w-3xl p-6">
          <p className="mb-3 font-semibold">Payments</p>
          {payments.length > 0 && (
            <ul className="mb-4 divide-y divide-slate-100 text-sm">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-800">
                    Received {money(p.amount, cur)} on {date(p.date)}{p.method && ` via ${p.method}`}{p.note && ` — ${p.note}`}
                  </span>
                  <button onClick={() => onDeletePayment?.(p.id)} className="flex-none text-slate-400 hover:text-red-600" aria-label="Remove payment">✕</button>
                </li>
              ))}
            </ul>
          )}
          {doc.balance > 0.001 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onAddPayment?.({
                  amount: Number(fd.get("amount")), date: String(fd.get("date") || ""),
                  method: String(fd.get("method") || ""), note: String(fd.get("note") || ""),
                });
                e.currentTarget.reset();
              }}
              className="grid gap-3 sm:grid-cols-4"
            >
              <input name="amount" type="number" step="any" placeholder={`Amount (balance ${money(doc.balance, cur)})`} required className="input sm:col-span-1" />
              <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="input sm:col-span-1" />
              <input name="method" placeholder="Method (bank, cash…)" className="input sm:col-span-1" />
              <div className="flex gap-2 sm:col-span-1">
                <input name="note" placeholder="Note" className="input" />
                <button className="btn-secondary shrink-0">Record</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
