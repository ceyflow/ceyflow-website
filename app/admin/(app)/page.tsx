"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getClients, getDocuments, getInquiries, type Client, type DocWithTotals, type Inquiry } from "../../../lib/adminData";
import { useSession } from "../../../lib/authClient";
import { useSettings } from "../../../lib/publicData";
import { money, date, isOverdue, displayStatus } from "../../../lib/format";
import { Badge } from "../../../components/admin/Badge";
import { DocListCard } from "../../../components/admin/DocListCard";
import { EmptyState } from "../../../components/admin/EmptyState";
import { adminBase } from "../../../lib/adminBase";

function StatCard({ label, value, sub, subTone }: { label: string; value: string; sub?: string; subTone?: "warn" }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {sub && <p className={`mt-1 text-xs ${subTone === "warn" ? "font-medium text-rose-600" : "text-slate-500"}`}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const base = adminBase();
  const { session } = useSession();
  const s = useSettings();
  const cur = s.currency || "LKR";
  const [invoices, setInvoices] = useState<DocWithTotals[]>([]);
  const [quotes, setQuotes] = useState<DocWithTotals[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    getDocuments("invoice").then(setInvoices);
    getDocuments("quote").then(setQuotes);
    getClients().then(setClients);
    getInquiries().then(setInquiries);
  }, []);

  const name = ((session?.user.user_metadata?.name as string | undefined) || "").split(" ")[0];
  const overdueInvoices = invoices.filter(isOverdue);
  const overdueTotal = overdueInvoices.reduce((a, i) => a + i.balance, 0);
  const outstanding = invoices.filter((i) => i.status !== "paid" && i.status !== "void").reduce((a, i) => a + i.balance, 0);
  const paidThisMonth = invoices
    .filter((i) => i.status === "paid" && i.updated_at.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((a, i) => a + i.total, 0);
  const openQuotes = quotes.filter((q) => q.status === "sent" || q.status === "draft").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const expiringQuotes = quotes.filter((q) => {
    if (q.status !== "sent" || !q.due_date) return false;
    const daysLeft = (new Date(q.due_date).getTime() - Date.now()) / 86400000;
    return daysLeft >= 0 && daysLeft <= 3;
  });
  const needsAttention = [...overdueInvoices, ...expiringQuotes].slice(0, 6);

  const recentDocs = [...invoices, ...quotes].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 6);

  const greeting = newInquiries > 0 || overdueInvoices.length > 0
    ? `Good to see you${name ? `, ${name}` : ""} — ${[
        overdueInvoices.length > 0 ? `${overdueInvoices.length} invoice${overdueInvoices.length > 1 ? "s" : ""} overdue` : null,
        newInquiries > 0 ? `${newInquiries} new inquir${newInquiries > 1 ? "ies" : "y"}` : null,
      ].filter(Boolean).join(", ")}.`
    : `Good to see you${name ? `, ${name}` : ""} — everything's on track.`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">{greeting}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`${base}/quotes/new`} className="btn-secondary">New quotation</Link>
          <Link href={`${base}/invoices/new`} className="btn-primary">New invoice</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={money(outstanding, cur)}
          sub={overdueTotal > 0 ? `of which ${money(overdueTotal, cur)} overdue` : `${invoices.filter((i) => i.balance > 0 && i.status !== "void").length} unpaid invoices`}
          subTone={overdueTotal > 0 ? "warn" : undefined}
        />
        <StatCard label="Paid this month" value={money(paidThisMonth, cur)} />
        <StatCard label="Open quotations" value={String(openQuotes)} />
        <StatCard label="New inquiries" value={String(newInquiries)} sub={clients.length + " clients total"} />
      </div>

      {needsAttention.length > 0 && (
        <div className="card p-5">
          <p className="mb-3 font-semibold">Needs attention</p>
          <ul className="divide-y divide-slate-100">
            {needsAttention.map((d) => (
              <li key={`${d.type}-${d.id}`}>
                <Link href={`${base}/${d.type}s/view?id=${d.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-brand-700">
                  <span className="min-w-0 truncate">
                    <span className="font-medium">{d.client_name}</span>
                    <span className="ml-2 text-slate-400">{d.number}</span>
                  </span>
                  <span className="flex flex-none items-center gap-2">
                    <span className="text-slate-500">
                      {d.type === "invoice" ? money(d.balance, cur) : `valid until ${date(d.due_date)}`}
                    </span>
                    <Badge value={displayStatus(d)} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Recent documents</p>
            <Link href={`${base}/invoices`} className="text-sm text-brand-700 hover:underline">View all</Link>
          </div>
          {recentDocs.length === 0 ? (
            <EmptyState text="Your quotations and invoices will show up here once you create the first one." actionLabel="Create your first invoice" actionHref={`${base}/invoices/new`} />
          ) : (
            <>
              <div className="space-y-2 sm:hidden">
                {recentDocs.map((d) => (
                  <DocListCard key={`${d.type}-${d.id}`} doc={d} href={`${base}/${d.type}s/view?id=${d.id}`} currency={cur} />
                ))}
              </div>
              <table className="table hidden sm:table">
                <thead><tr><th>Number</th><th>Client</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
                <tbody>
                  {recentDocs.map((d) => (
                    <tr key={`${d.type}-${d.id}`}>
                      <td><Link href={`${base}/${d.type}s/view?id=${d.id}`} className="font-medium text-brand-700 hover:underline">{d.number}</Link></td>
                      <td>{d.client_name}</td>
                      <td>{date(d.issue_date)}</td>
                      <td className="text-right">{money(d.total, cur)}</td>
                      <td><Badge value={displayStatus(d)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Latest inquiries</p>
            <Link href={`${base}/inquiries`} className="text-sm text-brand-700 hover:underline">View all</Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No inquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {inquiries.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.name} {i.company && <span className="text-slate-500">· {i.company}</span>}</p>
                    <p className="truncate text-xs text-slate-500">{i.interest || "General inquiry"}</p>
                  </div>
                  <Badge value={i.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
