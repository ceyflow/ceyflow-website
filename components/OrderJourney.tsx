"use client";
import { useScrollScrub } from "../lib/useScrollScrub";

const STAGES = [
  { key: "received", label: "Order received", time: "10:02 AM", detail: "Payment confirmed · COD verified" },
  { key: "processing", label: "Processing", time: "10:18 AM", detail: "Picked, packed & labeled" },
  { key: "dispatching", label: "Out for delivery", time: "11:40 AM", detail: "Handed to courier · Colombo hub" },
  { key: "delivered", label: "Delivered", time: "1:05 PM", detail: "Signed by receiver · SMS sent" },
] as const;

const ICONS = [
  // received — package
  <path key="box" d="M24 6 6 14v20l18 8 18-8V14L24 6Z M6 14l18 8 18-8 M24 22v20" />,
  // processing — clock
  <path key="clock" d="M24 6a18 18 0 1 0 .01 0Z M24 14v10l7 5" />,
  // dispatching — truck
  <path key="truck" d="M4 14h22v18H4Z M26 20h9l7 7v5H26Z M14 39a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M35 39a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  // delivered — check circle
  <path key="check" d="M24 6a18 18 0 1 0 .01 0Z M16 24l6 6 12-12" />,
];

function RING_R() {
  return 84;
}

export function OrderJourney() {
  const { ref, progress } = useScrollScrub<HTMLDivElement>();
  const stageFloat = progress * (STAGES.length - 1);
  const stageIndex = Math.min(STAGES.length - 1, Math.floor(stageFloat + 1e-6));
  const stage = STAGES[stageIndex];
  const r = RING_R();
  const circumference = 2 * Math.PI * r;

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

          {/* right: progress ring + icon + status panel */}
          <div className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
            <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
              <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="url(#journeyRingGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: "stroke-dashoffset 80ms linear" }}
              />
              <defs>
                <linearGradient id="journeyRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#49c8ef" />
                  <stop offset="100%" stopColor="#5470c5" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
              {ICONS.map((path, i) => (
                <svg
                  key={i}
                  viewBox="0 0 48 48"
                  className="absolute h-16 w-16 text-accent transition-opacity duration-300"
                  style={{ opacity: i === stageIndex ? 1 : 0 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {path}
                </svg>
              ))}
            </div>

            {/* status readout, echoing a dev-console panel */}
            <div className="absolute -bottom-8 left-1/2 w-60 -translate-x-1/2 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-white/70 backdrop-blur-sm md:-right-14 md:bottom-10 md:left-auto md:translate-x-0">
              <p className="text-accent">order.status</p>
              <p className="mt-0.5 text-white">
                → &quot;{stage.key}&quot;
              </p>
              <p className="mt-1 text-white/40">#1042 · {stage.time}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
