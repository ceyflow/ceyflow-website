"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDocuments, type DocWithTotals } from "../../../../lib/adminData";
import { useSettings } from "../../../../lib/publicData";
import { money, isOverdue } from "../../../../lib/format";
import { RevenueChart } from "../../../../components/admin/RevenueChart";
import { AgingBar } from "../../../../components/admin/AgingBar";
import { EmptyState } from "../../../../components/admin/EmptyState";
import { adminBase } from "../../../../lib/adminBase";

const RANGES = ["This month", "Last 3 months", "This year", "All time"] as const;
type Range = (typeof RANGES)[number];

function rangeStart(range: Range): Date | null {
  const now = new Date();
  if (range === "This month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (range === "Last 3 months") return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  if (range === "This year") return new Date(now.getFullYear(), 0, 1);
  return null;
}

function inRange(isoDate: string, start: Date | null): boolean {
  if (!start) return true;
  return new Date(isoDate + "T00:00:00") >= start;
}

function KpiTile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "warn" }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 font-display text-2xl font-bold ${tone === "warn" ? "text-rose-600" : ""}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function ReportsPage() {
  const base = adminBase();
  const settings = useSettings();
  const cur = settings.currency || "LKR";
  const [invoices, setInvoices] = useState<DocWithTotals[]>([]);
  const [quotes, setQuotes] = useState<DocWithTotals[]>([]);
  const [range, setRange] = useState<Range>("Last 3 months");

  useEffect(() => {
    getDocuments("invoice").then(setInvoices);
    getDocuments("quote").then(setQuotes);
  }, []);

  const start = rangeStart(range);
  const invoicesInRange = invoices.filter((i) => inRange(i.issue_date, start));
  const quotesInRange = quotes.filter((q) => inRange(q.issue_date, start));

  const revenueCollected = invoicesInRange.filter((i) => i.status === "paid").reduce((a, i) => a + i.total, 0);
  const outstandingBalance = invoices.filter((i) => i.status !== "paid" && i.status !== "void").reduce((a, i) => a + i.balance, 0);
  const overdueInvoices = invoices.filter(isOverdue);
  const overdueTotal = overdueInvoices.reduce((a, i) => a + i.balance, 0);
  const sentQuotes = quotesInRange.filter((q) => q.status !== "draft");
  const acceptedQuotes = quotesInRange.filter((q) => q.status === "accepted");
  const conversionRate = sentQuotes.length > 0 ? Math.round((acceptedQuotes.length / sentQuotes.length) * 100) : 0;

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-GB", { month: "short" }), value: 0 });
    }
    for (const inv of invoices) {
      if (inv.status !== "paid") continue;
      const d = new Date(inv.issue_date + "T00:00:00");
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.value += inv.total;
    }
    return months;
  }, [invoices]);

  const topClients = useMemo(() => {
    const byClient = new Map<number, { name: string; total: number }>();
    for (const inv of invoicesInRange) {
      if (inv.status === "void") continue;
      const entry = byClient.get(inv.client_id) || { name: inv.client_name, total: 0 };
      entry.total += inv.total;
      byClient.set(inv.client_id, entry);
    }
    return Array.from(byClient.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [invoicesInRange]);

  const agingBuckets = useMemo(() => {
    const buckets = { Current: 0, "1-30 days": 0, "31-60 days": 0, "60+ days": 0 };
    for (const inv of invoices) {
      if (inv.status === "paid" || inv.status === "void" || inv.balance <= 0) continue;
      if (!inv.due_date) { buckets.Current += inv.balance; continue; }
      const daysPast = Math.floor((Date.now() - new Date(inv.due_date + "T00:00:00").getTime()) / 86400000);
      if (daysPast <= 0) buckets.Current += inv.balance;
      else if (daysPast <= 30) buckets["1-30 days"] += inv.balance;
      else if (daysPast <= 60) buckets["31-60 days"] += inv.balance;
      else buckets["60+ days"] += inv.balance;
    }
    return Object.entries(buckets).map(([label, amount]) => ({ label, amount }));
  }, [invoices]);

  const hasAnyInvoices = invoices.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Reports</h1>
        <div className="flex gap-2 overflow-x-auto">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-none rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                range === r ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {!hasAnyInvoices ? (
        <div className="card">
          <EmptyState text="Your reports will appear here once you send your first invoice." actionLabel="Create your first invoice" actionHref={`${base}/invoices/new`} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiTile label="Money collected" value={money(revenueCollected, cur)} sub={range} />
            <KpiTile label="Money owed" value={money(outstandingBalance, cur)} sub="All unpaid, non-void invoices" />
            <KpiTile
              label="Overdue"
              value={money(overdueTotal, cur)}
              sub={`${overdueInvoices.length} invoice${overdueInvoices.length === 1 ? "" : "s"}`}
              tone={overdueTotal > 0 ? "warn" : undefined}
            />
            <KpiTile label="Quote conversion" value={`${conversionRate}%`} sub={`${acceptedQuotes.length} of ${sentQuotes.length} sent, ${range.toLowerCase()}`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <p className="mb-4 font-semibold">Revenue over time (last 6 months)</p>
              <RevenueChart data={monthlyRevenue} currency={cur} />
            </div>
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">Best clients</p>
                <Link href={`${base}/clients`} className="text-sm text-brand-700 hover:underline">View all</Link>
              </div>
              {topClients.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No billing in this period yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {topClients.map((c) => (
                    <li key={c.name} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="truncate">{c.name}</span>
                      <span className="font-medium">{money(c.total, cur)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card p-5">
            <p className="mb-4 font-semibold">Outstanding by age</p>
            <AgingBar buckets={agingBuckets} currency={cur} />
          </div>
        </>
      )}
    </div>
  );
}
