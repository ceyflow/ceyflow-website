"use client";
import { useScrollScrub } from "../lib/useScrollScrub";
import { PhoneMockup } from "./PhoneMockup";

const STAGES = [
  { key: "received", label: "Order received", time: "10:02 AM", detail: "Payment confirmed · COD verified" },
  { key: "processing", label: "Processing", time: "10:18 AM", detail: "Picked, packed & labeled" },
  { key: "dispatching", label: "Out for delivery", time: "11:40 AM", detail: "Handed to courier · Colombo hub" },
  { key: "delivered", label: "Delivered", time: "1:05 PM", detail: "Signed by receiver · SMS sent" },
] as const;

function iconProps(className: string) {
  return { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };
}

function BoxIcon({ className }: { className: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M24 6 6 14v20l18 8 18-8V14L24 6Z" />
      <path d="M6 14l18 8 18-8M24 22v20" />
    </svg>
  );
}

function ClockIcon({ className }: { className: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 14v10l7 5" />
    </svg>
  );
}

function TruckIcon({ className }: { className: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 14h22v18H4Z" />
      <path d="M26 20h9l7 7v5H26Z" />
      <circle cx="14" cy="39" r="3" />
      <circle cx="35" cy="39" r="3" />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="24" cy="24" r="18" />
      <path d="M16 24l6 6 12-12" />
    </svg>
  );
}

function ReceivedScreen() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-600 to-brand-900 px-3 pt-8">
      <p className="text-center text-[10px] font-medium text-white/70">9:41</p>
      <div className="animate-notif-drop mt-8 rounded-xl bg-white p-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <BoxIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-slate-800">New order received</p>
            <p className="text-[10px] text-slate-500">#1042 · Rs 4,250 · just now</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] text-white/50">Payment confirmed · COD verified</p>
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-6 text-center">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 48 48" className="animate-spin-slow h-full w-full" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#e2e8f0" strokeWidth="4" />
          <path d="M24 4a20 20 0 0 1 20 20" stroke="#3853a4" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <ClockIcon className="absolute inset-0 m-auto h-6 w-6 text-brand-700" />
      </div>
      <p className="text-[11px] font-semibold text-slate-800">Processing your order</p>
      <p className="text-[10px] text-slate-500">Picked, packed &amp; labeled</p>
    </div>
  );
}

function DispatchingScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-6">
      <p className="text-center text-[11px] font-semibold text-slate-800">Out for delivery</p>
      <div className="relative h-6 w-full">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-100" />
        <div className="animate-truck-move absolute top-1/2 -translate-y-1/2">
          <TruckIcon className="h-6 w-6 text-brand-700" />
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-500">Colombo hub → your address</p>
    </div>
  );
}

function DeliveredScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-6 text-center">
      <div className="animate-check-pop flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-2 ring-emerald-200">
        <CheckIcon className="h-8 w-8" />
      </div>
      <p className="text-[11px] font-semibold text-slate-800">Delivered</p>
      <p className="text-[10px] text-slate-500">Signed by receiver · SMS sent</p>
    </div>
  );
}

const SCREENS = [ReceivedScreen, ProcessingScreen, DispatchingScreen, DeliveredScreen];

export function OrderJourney() {
  const { ref, progress } = useScrollScrub<HTMLDivElement>();
  const stageFloat = progress * (STAGES.length - 1);
  const stageIndex = Math.min(STAGES.length - 1, Math.floor(stageFloat + 1e-6));
  const stage = STAGES[stageIndex];
  const Screen = SCREENS[stageIndex];

  return (
    <section ref={ref} className="relative bg-ink" style={{ height: "340vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* ambient glow background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 18%, rgba(73,200,239,0.22), transparent 55%), radial-gradient(circle at 82% 82%, rgba(84,112,197,0.30), transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          {/* left: heading + stepper */}
          <div>
            <p className="text-sm font-semibold text-accent">Live, from order to doorstep</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Every order, tracked automatically
            </h2>
            <p className="mt-3 max-w-md text-white/60">
              No manual updates. Ceyflow moves the order through each stage and tells the customer the moment it happens.
            </p>

            <ol className="mt-10 space-y-5">
              {STAGES.map((s, i) => {
                const reached = stageIndex >= i;
                const done = stageIndex > i;
                const isCurrent = stageIndex === i;
                return (
                  <li key={s.key} className="flex items-start gap-4">
                    <span
                      className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300 ${
                        reached ? "border-accent bg-accent/15 text-accent" : "border-white/15 text-white/30"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${reached ? "text-white" : "text-white/35"}`}>
                        {s.label}
                      </p>
                      <p
                        className="mt-0.5 text-xs text-white/50 transition-opacity duration-300"
                        style={{ opacity: isCurrent ? 1 : 0, height: isCurrent ? "auto" : 0 }}
                      >
                        {s.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* right: animated phone mockup walking through the order lifecycle */}
          <div className="flex flex-col items-center">
            <div className="animate-float">
              <PhoneMockup size={240}>
                <div key={stageIndex} className="animate-stage-fade h-full w-full">
                  <Screen />
                </div>
              </PhoneMockup>
            </div>
            <p className="mt-6 font-mono text-xs text-white/40">
              #1042 · {stage.label} · {stage.time}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
