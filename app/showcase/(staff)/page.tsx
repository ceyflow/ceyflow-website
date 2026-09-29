"use client";
import { useState } from "react";
import { useShowcaseOrders } from "@/lib/useShowcaseOrders";
import { StagePill } from "@/components/showcase/Pills";
import { OrderDrawer } from "@/components/showcase/OrderDrawer";
import { SmsToast, type SmsToastMessage } from "@/components/showcase/SmsToast";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function ShowcaseDashboard() {
  const orders = useShowcaseOrders();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<SmsToastMessage[]>([]);

  const inProgress = orders.filter((o) => o.stage < 3).length;
  const weekAgo = Date.now() - 7 * 86400_000;
  const deliveredThisWeek = orders.filter((o) => o.stage === 3 && new Date(o.history.find((h) => h.stage === 3)?.at || 0).getTime() >= weekAgo).length;
  const rated = orders.filter((o) => o.rating != null);
  const avgRating = rated.length ? (rated.reduce((a, o) => a + (o.rating || 0), 0) / rated.length).toFixed(1) : "—";
  const recent = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);
  const selected = orders.find((o) => o.id === selectedId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">A live look at today's orders and deliveries.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total orders" value={String(orders.length)} />
        <StatCard label="In progress" value={String(inProgress)} />
        <StatCard label="Delivered this week" value={String(deliveredThisWeek)} />
        <StatCard label="Avg. customer rating" value={avgRating === "—" ? avgRating : `${avgRating} ★`} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-3 font-semibold text-slate-900">Recent orders</p>
        <div className="space-y-2 sm:hidden">
          {recent.map((o) => (
            <button key={o.id} onClick={() => setSelectedId(o.id)} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 p-3 text-left">
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-900">{o.customerName}</span>
                <span className="block truncate text-xs text-slate-500">{o.orderNumber} · {o.product}</span>
              </span>
              <StagePill stage={o.stage} />
            </button>
          ))}
        </div>
        <table className="hidden w-full text-sm sm:table">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-3 py-2">Order</th>
              <th className="border-b border-slate-200 px-3 py-2">Customer</th>
              <th className="border-b border-slate-200 px-3 py-2">Product</th>
              <th className="border-b border-slate-200 px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedId(o.id)}>
                <td className="border-b border-slate-100 px-3 py-2.5 font-medium text-indigo-700">{o.orderNumber}</td>
                <td className="border-b border-slate-100 px-3 py-2.5">{o.customerName}</td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-slate-600">{o.product}</td>
                <td className="border-b border-slate-100 px-3 py-2.5"><StagePill stage={o.stage} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <OrderDrawer order={selected} onClose={() => setSelectedId(null)} onSms={(t) => setToasts((ts) => [...ts, t])} />}
      <SmsToast toasts={toasts} onDismiss={(id) => setToasts((ts) => ts.filter((t) => t.id !== id))} />
    </div>
  );
}
