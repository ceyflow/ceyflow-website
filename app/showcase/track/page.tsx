"use client";
import { useEffect, useState } from "react";
import { BUSINESS_NAME, showcaseStore, type ShowcaseOrder } from "@/lib/showcaseData";
import { StagePill } from "@/components/showcase/Pills";
import { DeliveryTracker, CourierTimeline, StarRating } from "@/components/showcase/DeliveryTracker";
import { useShowcaseOrders } from "@/lib/useShowcaseOrders";

function TrackContent() {
  const orders = useShowcaseOrders();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  // Static export can't read the query string on the server, so pick up a
  // ?order= deep link from the browser after mount instead of useSearchParams
  // (which forces this whole page into client-only rendering under `output: export`).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("order");
    if (fromUrl) {
      setQuery(fromUrl);
      setSearched(true);
    }
  }, []);

  const order: ShowcaseOrder | undefined = searched ? showcaseStore.findByNumberOrPhone(query) || orders.find((o) => o.orderNumber === query) : undefined;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-display text-base font-bold text-white">L</span>
        <p className="mt-2 font-display text-lg font-bold text-slate-900">{BUSINESS_NAME}</p>
        <p className="text-sm text-slate-500">Track your order</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
        className="mb-6 flex gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Order number or phone"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <button type="submit" className="flex-none rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Track</button>
      </form>

      {searched && !order && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
          We couldn't find that order. Double-check the order number or phone and try again.
        </p>
      )}

      {order && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">{order.orderNumber}</p>
              <p className="font-display text-base font-bold text-slate-900">{order.product}</p>
            </div>
            <StagePill stage={order.stage} />
          </div>
          <div className="mt-5">
            <DeliveryTracker order={order} />
            <CourierTimeline order={order} />
            <StarRating order={order} />
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-[11px] text-slate-300">
        A live product demo built by{" "}
        <a href="https://ceyflow.github.io/ceyflow-website/" target="_blank" rel="noreferrer" className="text-slate-400 underline hover:text-indigo-600">Ceyflow</a>
      </p>
    </div>
  );
}

export default function ShowcaseTrackPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TrackContent />
    </div>
  );
}
