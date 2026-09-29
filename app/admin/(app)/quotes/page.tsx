"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocuments, type DocWithTotals } from "../../../../lib/adminData";
import { useSettings } from "../../../../lib/publicData";
import { Badge } from "../../../../components/admin/Badge";
import { money, date } from "../../../../lib/format";
import { adminBase } from "../../../../lib/adminBase";

export default function QuotesPage() {
  const base = adminBase();
  const [quotes, setQuotes] = useState<DocWithTotals[]>([]);
  const cur = useSettings().currency || "LKR";

  useEffect(() => { getDocuments("quote").then(setQuotes); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Quotations</h1>
        <Link href={`${base}/quotes/new`} className="btn-primary">New quotation</Link>
      </div>
      <div className="card overflow-x-auto">
        {quotes.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No quotations yet.</p>
        ) : (
          <table className="table">
            <thead><tr><th>Number</th><th>Client</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td><Link href={`${base}/quotes/view?id=${q.id}`} className="font-medium text-brand-700 hover:underline">{q.number}</Link></td>
                  <td>{q.client_name}</td>
                  <td>{date(q.issue_date)}</td>
                  <td className="text-right">{money(q.total, cur)}</td>
                  <td><Badge value={q.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
