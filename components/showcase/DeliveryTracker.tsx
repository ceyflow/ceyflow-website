"use client";
import { useState } from "react";
import { ORDER_STAGES, COURIER_NAME, showcaseStore, type ShowcaseOrder } from "@/lib/showcaseData";

export function DeliveryTracker({ order }: { order: ShowcaseOrder }) {
  return (
    <div className="flex items-start justify-between">
      {ORDER_STAGES.map((s, i) => {
        const done = i < order.stage;
        const active = i === order.stage;
        return (
          <div key={s.key} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done || active ? "bg-emerald-500" : "bg-slate-200"}`} />
              <span
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-white ${
                  done ? "bg-emerald-500" : active ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-slate-200 text-slate-400"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </span>
              <div className={`h-0.5 flex-1 ${i === ORDER_STAGES.length - 1 ? "invisible" : done ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
            <p className={`mt-2 max-w-[6.5rem] text-[11px] font-medium ${active ? "text-emerald-700" : done ? "text-slate-600" : "text-slate-400"}`}>{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function CourierTimeline({ order }: { order: ShowcaseOrder }) {
  if (order.stage < 3 || !order.trackingNumber) return null;
  const pickedUpAt = order.history.find((h) => h.stage === 3)?.at || order.createdAt;
  const events = [
    { label: "Delivered", detail: order.address, at: new Date(new Date(pickedUpAt).getTime() + 5.5 * 3600_000) },
    { label: "Out for delivery", detail: "Nearby your area", at: new Date(new Date(pickedUpAt).getTime() + 3 * 3600_000) },
    { label: "Arrived at local hub", detail: "Sorting facility", at: new Date(new Date(pickedUpAt).getTime() + 1 * 3600_000) },
    { label: "Picked up", detail: `Handed to ${COURIER_NAME}`, at: new Date(pickedUpAt) },
  ].filter((e) => e.at.getTime() <= Date.now());

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold text-slate-600">{COURIER_NAME} · tracking #{order.trackingNumber}</p>
      <ul className="space-y-2.5">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs">
            <span className={`mt-0.5 h-2 w-2 flex-none rounded-full ${i === 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
            <div className="min-w-0">
              <p className={`font-medium ${i === 0 ? "text-emerald-700" : "text-slate-600"}`}>{e.label}</p>
              <p className="text-slate-400">{e.detail} · {e.at.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StarRating({ order }: { order: ShowcaseOrder }) {
  const [hover, setHover] = useState(0);
  if (order.stage < 3) return null;

  return (
    <div className="mt-4 border-t border-slate-100 pt-4 text-center">
      {order.rating ? (
        <p className="text-sm text-slate-600">Thanks for rating us! <span className="text-amber-500">{"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)}</span></p>
      ) : (
        <>
          <p className="mb-2 text-sm font-medium text-slate-700">How was your delivery?</p>
          <div className="flex justify-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => showcaseStore.rateOrder(order.id, n)}
                onMouseEnter={() => setHover(n)}
                className="text-2xl text-amber-400 transition"
                aria-label={`Rate ${n} stars`}
              >
                {n <= hover ? "★" : "☆"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
