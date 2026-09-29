"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { convertQuoteToInvoice, getDocuments, type DocWithTotals } from "../../../../lib/adminData";
import { useSettings } from "../../../../lib/publicData";
import { Badge } from "../../../../components/admin/Badge";
import { DocListCard } from "../../../../components/admin/DocListCard";
import { StatusFilterPills } from "../../../../components/admin/StatusFilterPills";
import { EmptyState } from "../../../../components/admin/EmptyState";
import { money, date } from "../../../../lib/format";
import { adminBase } from "../../../../lib/adminBase";

const FILTERS = ["all", "draft", "sent", "accepted", "declined", "expired"];

export default function QuotesPage() {
  const base = adminBase();
  const router = useRouter();
  const [quotes, setQuotes] = useState<DocWithTotals[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const settings = useSettings();
  const cur = settings.currency || "LKR";

  function refresh() {
    getDocuments("quote").then(setQuotes);
  }
  useEffect(refresh, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: quotes.length };
    for (const q of quotes) c[q.status] = (c[q.status] || 0) + 1;
    return c;
  }, [quotes]);

  const filtered = quotes.filter((q) => {
    if (filter !== "all" && q.status !== filter) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      if (!q.number.toLowerCase().includes(s) && !q.client_name.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  async function handleConvert(id: number) {
    const invoiceId = await convertQuoteToInvoice(id, settings);
    if (invoiceId) router.push(`${base}/invoices/view?id=${invoiceId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Quotations</h1>
        <Link href={`${base}/quotes/new`} className="btn-primary hidden sm:inline-flex">New quotation</Link>
      </div>

      {quotes.length > 0 && (
        <div className="space-y-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client or quote number" className="input sm:max-w-xs" />
          <StatusFilterPills options={FILTERS} active={filter} onChange={setFilter} counts={counts} />
        </div>
      )}

      <div className="card overflow-x-auto">
        {quotes.length === 0 ? (
          <EmptyState text="Your quotations will show up here once you create the first one." actionLabel="Create your first quotation" actionHref={`${base}/quotes/new`} />
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No quotations match this filter.</p>
        ) : (
          <>
            <div className="space-y-2 p-3 sm:hidden">
              {filtered.map((q) => (
                <DocListCard key={q.id} doc={q} href={`${base}/quotes/view?id=${q.id}`} currency={cur} />
              ))}
            </div>
            <table className="table hidden sm:table">
              <thead><tr><th>Number</th><th>Client</th><th>Date</th><th className="text-right">Total</th><th>Status</th><th /></tr></thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id}>
                    <td><Link href={`${base}/quotes/view?id=${q.id}`} className="font-medium text-brand-700 hover:underline">{q.number}</Link></td>
                    <td>{q.client_name}</td>
                    <td>{date(q.issue_date)}</td>
                    <td className="text-right">{money(q.total, cur)}</td>
                    <td><Badge value={q.status} /></td>
                    <td className="text-right">
                      {q.status === "accepted" && (
                        <button onClick={() => handleConvert(q.id)} className="text-xs font-semibold text-brand-700 hover:underline">Convert to invoice</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Link
        href={`${base}/quotes/new`}
        aria-label="New quotation"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-brand-900 shadow-lg sm:hidden"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </Link>
    </div>
  );
}
