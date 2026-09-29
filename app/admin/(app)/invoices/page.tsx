"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDocuments, type DocWithTotals } from "../../../../lib/adminData";
import { useSettings } from "../../../../lib/publicData";
import { Badge } from "../../../../components/admin/Badge";
import { DocListCard } from "../../../../components/admin/DocListCard";
import { StatusFilterPills } from "../../../../components/admin/StatusFilterPills";
import { EmptyState } from "../../../../components/admin/EmptyState";
import { money, date, displayStatus, digitsOnly } from "../../../../lib/format";
import { adminBase } from "../../../../lib/adminBase";

const FILTERS = ["all", "draft", "sent", "overdue", "partially paid", "paid"];

function reminderHref(inv: DocWithTotals, companyName: string) {
  const text = `Hi ${inv.client_name}, this is a reminder that ${inv.number} (${money(inv.balance)}) is overdue. You can view it here: — ${companyName}`;
  const phone = inv.client_phone ? digitsOnly(inv.client_phone) : "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function InvoicesList() {
  const base = adminBase();
  const initialFilter = useSearchParams().get("status") || "all";
  const [invoices, setInvoices] = useState<DocWithTotals[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState("");
  const settings = useSettings();
  const cur = settings.currency || "LKR";

  useEffect(() => { getDocuments("invoice").then(setInvoices); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: invoices.length };
    for (const inv of invoices) {
      const s = displayStatus(inv);
      c[s] = (c[s] || 0) + 1;
    }
    return c;
  }, [invoices]);

  const filtered = invoices.filter((inv) => {
    if (filter !== "all" && displayStatus(inv) !== filter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!inv.number.toLowerCase().includes(q) && !inv.client_name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Invoices</h1>
        <Link href={`${base}/invoices/new`} className="btn-primary hidden sm:inline-flex">New invoice</Link>
      </div>

      {invoices.length > 0 && (
        <div className="space-y-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or invoice number"
            className="input sm:max-w-xs"
          />
          <StatusFilterPills options={FILTERS} active={filter} onChange={setFilter} counts={counts} />
        </div>
      )}

      <div className="card overflow-x-auto">
        {invoices.length === 0 ? (
          <EmptyState text="Your invoices will show up here once you create the first one." actionLabel="Create your first invoice" actionHref={`${base}/invoices/new`} />
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No invoices match this filter.</p>
        ) : (
          <>
            <div className="space-y-2 p-3 sm:hidden">
              {filtered.map((inv) => (
                <DocListCard key={inv.id} doc={inv} href={`${base}/invoices/view?id=${inv.id}`} currency={cur} />
              ))}
            </div>
            <table className="table hidden sm:table">
              <thead><tr><th>Number</th><th>Client</th><th>Date</th><th className="text-right">Total</th><th className="text-right">Balance</th><th>Status</th><th /></tr></thead>
              <tbody>
                {filtered.map((inv) => {
                  const overdue = displayStatus(inv) === "overdue";
                  return (
                    <tr key={inv.id}>
                      <td><Link href={`${base}/invoices/view?id=${inv.id}`} className="font-medium text-brand-700 hover:underline">{inv.number}</Link></td>
                      <td>{inv.client_name}</td>
                      <td>{date(inv.issue_date)}</td>
                      <td className="text-right">{money(inv.total, cur)}</td>
                      <td className={`text-right ${inv.balance > 0 ? "font-medium text-amber-700" : "text-slate-400"}`}>{money(inv.balance, cur)}</td>
                      <td><Badge value={displayStatus(inv)} /></td>
                      <td className="text-right">
                        {overdue && (
                          <a
                            href={reminderHref(inv, settings.company_name || "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-emerald-700 hover:underline"
                            title="Send a WhatsApp reminder"
                          >
                            Remind
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Link
        href={`${base}/invoices/new`}
        aria-label="New invoice"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-brand-900 shadow-lg sm:hidden"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </Link>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesList />
    </Suspense>
  );
}
