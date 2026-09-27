import Link from "next/link";
import { getDocuments, getSettings } from "../../../../lib/db";
import { Badge } from "../../../../components/admin/Badge";
import { money, date } from "../../../../lib/format";

export default function InvoicesPage() {
  const invoices = getDocuments("invoice");
  const cur = getSettings().currency || "LKR";
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Invoices</h1>
        <Link href="/admin/invoices/new" className="btn-primary">New invoice</Link>
      </div>
      <div className="card overflow-x-auto">
        {invoices.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No invoices yet.</p>
        ) : (
          <table className="table">
            <thead><tr><th>Number</th><th>Client</th><th>Date</th><th className="text-right">Total</th><th className="text-right">Balance</th><th>Status</th></tr></thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td><Link href={`/admin/invoices/${inv.id}`} className="font-medium text-brand-700 hover:underline">{inv.number}</Link></td>
                  <td>{inv.client_name}</td>
                  <td>{date(inv.issue_date)}</td>
                  <td className="text-right">{money(inv.total, cur)}</td>
                  <td className={`text-right ${inv.balance > 0 ? "font-medium text-amber-700" : "text-slate-400"}`}>{money(inv.balance, cur)}</td>
                  <td><Badge value={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
