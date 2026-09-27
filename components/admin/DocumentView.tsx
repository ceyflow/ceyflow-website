import Link from "next/link";
import type { Client, DocItem, DocType, DocWithTotals, Payment, Settings } from "../../lib/db";
import { money, date, QUOTE_STATUSES, INVOICE_STATUSES } from "../../lib/format";
import { Badge } from "./Badge";
import {
  addPayment, convertQuoteToInvoice, deleteDocument, deletePayment, setDocumentStatus,
} from "../../lib/actions";
import { PrintButton } from "./PrintButton";
import { StatusSelect } from "./StatusSelect";

export function DocumentView({
  type, doc, items, client, settings, payments,
}: {
  type: DocType; doc: DocWithTotals; items: DocItem[]; client: Client; settings: Settings; payments?: Payment[];
}) {
  const cur = settings.currency || "LKR";
  const statuses = type === "quote" ? QUOTE_STATUSES : INVOICE_STATUSES;
  const label = type === "quote" ? "Quotation" : "Invoice";

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/${type}s`} className="text-slate-400 hover:text-slate-700">←</Link>
          <h1 className="font-display text-2xl font-bold">{doc.number}</h1>
          <Badge value={doc.status} />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusSelect
            action={async (fd) => { "use server"; await setDocumentStatus(type, doc.id, String(fd.get("status"))); }}
            defaultValue={doc.status}
            options={statuses}
            className="input py-1.5 text-sm capitalize"
          />
          {type === "quote" && doc.status !== "declined" && (
            <form action={async () => { "use server"; await convertQuoteToInvoice(doc.id); }}>
              <button className="btn-secondary">Convert to invoice</button>
            </form>
          )}
          <Link href={`/admin/${type}s/${doc.id}/edit`} className="btn-secondary">Edit</Link>
          <PrintButton />
          <form action={async () => { "use server"; await deleteDocument(type, doc.id); }}>
            <button className="btn-danger">Delete</button>
          </form>
        </div>
      </div>

      <div className="print-sheet card mx-auto max-w-3xl p-8 md:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <p className="font-display text-xl font-extrabold text-brand-800">{settings.company_name}</p>
            <p className="mt-1 text-sm text-slate-500">{settings.company_address}</p>
            <p className="text-sm text-slate-500">{settings.company_email} · {settings.company_phone}</p>
          </div>
          <div className="text-right">
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

        {doc.notes && <p className="mt-8 text-sm text-slate-600">{doc.notes}</p>}
        {doc.terms && (
          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p className="mb-1 font-semibold text-slate-600">Terms</p>
            <p className="whitespace-pre-line">{doc.terms}</p>
          </div>
        )}
        {type === "invoice" && settings.bank_details && (
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
                <li key={p.id} className="flex items-center justify-between py-2">
                  <span>{date(p.date)} {p.method && `· ${p.method}`} {p.note && `· ${p.note}`}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-medium">{money(p.amount, cur)}</span>
                    <form action={async () => { "use server"; await deletePayment(doc.id, p.id); }}>
                      <button className="text-slate-400 hover:text-red-600" aria-label="Remove payment">✕</button>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {doc.balance > 0.001 && (
            <form action={async (fd) => { "use server"; await addPayment(doc.id, fd); }} className="grid gap-3 sm:grid-cols-4">
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
