"use client";
import { useState } from "react";
import { useShowcaseOrders } from "@/lib/useShowcaseOrders";
import { ORDER_STAGES, STAGE_COLORS, type ShowcaseOrder } from "@/lib/showcaseData";
import { PriorityPill } from "@/components/showcase/Pills";
import { OrderDrawer } from "@/components/showcase/OrderDrawer";
import { SmsToast, type SmsToastMessage } from "@/components/showcase/SmsToast";

function OrderCard({ order, onClick }: { order: ShowcaseOrder; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-indigo-300 hover:shadow">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-slate-900">{order.customerName}</p>
        <PriorityPill priority={order.priority} />
      </div>
      <p className="mt-0.5 truncate text-xs text-slate-500">{order.product}</p>
      <p className="mt-1.5 text-[11px] font-medium text-slate-400">{order.orderNumber}</p>
    </button>
  );
}

export default function ShowcaseOrders() {
  const orders = useShowcaseOrders();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<SmsToastMessage[]>([]);

  const filtered = query
    ? orders.filter((o) => `${o.customerName} ${o.orderNumber} ${o.product}`.toLowerCase().includes(query.toLowerCase()))
    : orders;
  const selected = orders.find((o) => o.id === selectedId);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Drag through the pipeline from a new order to delivered.</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders…"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
        />
      </div>

      <div className="grid gap-4 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-4 lg:overflow-visible">
        {ORDER_STAGES.map((stage) => {
          const stageOrders = filtered.filter((o) => o.stage === stage.key);
          const c = STAGE_COLORS[stage.key];
          return (
            <div key={stage.key} className="min-w-[240px] rounded-xl bg-slate-100/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className={`text-xs font-semibold uppercase tracking-wide ${c.text}`}>{stage.label}</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">{stageOrders.length}</span>
              </div>
              <div className="space-y-2">
                {stageOrders.length === 0 ? (
                  <p className="px-1 text-xs text-slate-400">No orders here</p>
                ) : (
                  stageOrders.map((o) => <OrderCard key={o.id} order={o} onClick={() => setSelectedId(o.id)} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && <OrderDrawer order={selected} onClose={() => setSelectedId(null)} onSms={(t) => setToasts((ts) => [...ts, t])} />}
      <SmsToast toasts={toasts} onDismiss={(id) => setToasts((ts) => ts.filter((t) => t.id !== id))} />
    </div>
  );
}
