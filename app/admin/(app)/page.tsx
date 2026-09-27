"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getClients, getDocuments, getInquiries, type Client, type DocWithTotals, type Inquiry } from "../../../lib/adminData";
import { useSettings } from "../../../lib/publicData";
import { money, date } from "../../../lib/format";
import { Badge } from "../../../components/admin/Badge";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
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

  const outstanding = invoices.filter((i) => i.status !== "paid" && i.status !== "void").reduce((a, i) => a + i.balance, 0);
  const paidThisMonth = invoices
    .filter((i) => i.status === "paid" && i.updated_at.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((a, i) => a + i.total, 0);
  const openQuotes = quotes.filter((q) => q.status === "sent" || q.status === "draft").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const recentDocs = [...invoices, ...quotes].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/quotes/new" className="btn-secondary">New quotation</Link>
          <Link href="/admin/invoices/new" className="btn-primary">New invoice</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding" value={money(outstanding, cur)} sub={`${invoices.filter((i) => i.balance > 0 && i.status !== "void").length} unpaid invoices`} />
        <StatCard label="Paid this month" value={money(paidThisMonth, cur)} />
        <StatCard label="Open quotations" value={String(openQuotes)} />
        <StatCard label="New inquiries" value={String(newInquiries)} sub={clients.length + " clients total"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Recent documents</p>
            <Link href="/admin/invoices" className="text-sm text-brand-700 hover:underline">View all</Link>
          </div>
          {recentDocs.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No quotations or invoices yet.</p>
          ) : (
            <table className="table">
              <thead><tr><th>Number</th><th>Client</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
              <tbody>
                {recentDocs.map((d) => (
                  <tr key={`${d.type}-${d.id}`}>
                    <td><Link href={`/admin/${d.type}s/view?id=${d.id}`} className="font-medium text-brand-700 hover:underline">{d.number}</Link></td>
                    <td>{d.client_name}</td>
                    <td>{date(d.issue_date)}</td>
                    <td className="text-right">{money(d.total, cur)}</td>
                    <td><Badge value={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Latest inquiries</p>
            <Link href="/admin/inquiries" className="text-sm text-brand-700 hover:underline">View all</Link>
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
