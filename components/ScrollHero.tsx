"use client";
import { useScrollProgress } from "../lib/useScrollProgress";

const orders = [
  { id: "#1042", customer: "Nadeesha K.", item: "2x Order · Colombo 05", status: "Processing" as const },
  { id: "#1041", customer: "Ruwan S.", item: "1x Order · Kandy", status: "Shipped" as const },
  { id: "#1040", customer: "Aisha M.", item: "3x Order · Galle", status: "Delivered" as const },
];

const statusStyle: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700 ring-amber-200",
  Shipped: "bg-brand-50 text-brand-700 ring-brand-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function ScrollHero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  // Ease the raw scroll progress so the motion settles rather than tracking linearly.
  const eased = progress * progress * (3 - 2 * progress);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/50 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div ref={ref} className="relative mx-auto max-w-2xl">
          {/* Browser mockup */}
          <div
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/10"
            style={{ transform: `translateY(${-eased * 14}px) scale(${1 + eased * 0.03})` }}
          >
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 rounded-full bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200">
                ceyflow.lk/admin/orders
              </span>
            </div>
            <div className="space-y-2 bg-slate-50/60 p-4 md:p-6">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 ring-1 ring-slate-100">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {o.id} <span className="font-normal text-slate-500">· {o.customer}</span>
                    </p>
                    <p className="text-xs text-slate-400">{o.item}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyle[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SMS bubble popping out as the mockup scrolls into view */}
          <div
            className="absolute top-[38%] right-[2%] w-52 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-100 sm:right-[-6%] sm:w-56 md:right-[-14%]"
            style={{
              opacity: Math.min(1, eased * 2.2),
              transform: `translate(${eased * 16}px, ${-eased * 44}px) rotate(${-5 + eased * 5}deg) scale(${0.85 + eased * 0.25})`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-700 text-[11px] font-bold text-white">
                C
              </span>
              <p className="text-xs font-semibold text-slate-700">SMS sent</p>
              <span className="ml-auto text-[10px] font-medium text-emerald-600">✓ Delivered</span>
            </div>
            <p className="mt-2 text-xs leading-snug text-slate-500">
              &ldquo;Hi Nadeesha, your order #1042 is out for delivery 🚚 Track: ceyflow.lk/t/1042&rdquo;
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-sm text-slate-500">
          Every status update goes out the moment it happens — nobody on your team has to type it.
        </p>
      </div>
    </section>
  );
}
