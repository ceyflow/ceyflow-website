"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocuments, type DocWithTotals } from "../../../../lib/adminData";
import { useSettings } from "../../../../lib/publicData";
import { Badge } from "../../../../components/admin/Badge";
import { money, date } from "../../../../lib/format";
import { adminBase } from "../../../../lib/adminBase";

export default function InvoicesPage() {
  const base = adminBase();
  const [invoices, setInvoices] = useState<DocWithTotals[]>([]);
  const cur = useSettings().currency || "LKR";

  useEffect(() => { getDocuments("invoice").then(setInvoices); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Invoices</h1>
        <Link href={`${base}/invoices/new`} className="btn-primary">New invoice</Link>
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
                  <td><Link href={`${base}/invoices/view?id=${inv.id}`} className="font-medium text-brand-700 hover:underline">{inv.number}</Link></td>
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
