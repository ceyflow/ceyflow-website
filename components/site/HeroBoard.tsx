"use client";
import { useEffect, useState } from "react";

// A small, self-playing example of the product: orders slide across the stages of a
// board and, when one goes out for delivery, the customer is sent a text. The data is
// fictional. With "reduce motion" on, it shows one still frame instead of playing.

const STAGES = ["Received", "Processing", "Checking", "Out for delivery"] as const;

type Order = { no: number; name: string; city: string; item: string };
const ORDERS: Order[] = [
  { no: 1044, name: "Shalini K.", city: "Negombo", item: "Herbal tea set × 2" },
  { no: 1043, name: "Hasitha S.", city: "Kurunegala", item: "Spice pack × 3" },
  { no: 1042, name: "Nadeesha K.", city: "Colombo 05", item: "Gift hamper × 1" },
  { no: 1041, name: "Ruwan S.", city: "Kandy", item: "Spice pack × 2" },
  { no: 1040, name: "Aisha M.", city: "Galle", item: "Herbal tea set × 1" },
];

const START = [0, 0, 1, 2, 3]; // stage of each order when the loop starts
const SCRIPT = [1, 0, 1, 3, 2, 2]; // which order moves forward one stage on each beat
const BEAT_MS = 2200;

const PITCH = 92; // vertical distance between cards in a column
const TOP = 64; // space for the column headings
const CARD_H = 80;

function useBoardLoop() {
  const [step, setStep] = useState(SCRIPT.length); // still frame until the client starts playing
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setLive(true);
    setStep(0);
    let beat = 0;
    const id = window.setInterval(() => {
      beat = (beat + 1) % (SCRIPT.length + 2); // two extra beats to rest on the finished board
      setStep(Math.min(beat, SCRIPT.length));
    }, BEAT_MS);
    return () => window.clearInterval(id);
  }, []);

  const stages = START.slice();
  for (let k = 0; k < step; k++) stages[SCRIPT[k]] += 1;
  const last = step > 0 ? SCRIPT[step - 1] : -1;
  const sms = last >= 0 && stages[last] === 3 ? ORDERS[last] : null;
  return { step, live, stages, last, sms };
}

function SmsNote({ order, className = "" }: { order: Order; className?: string }) {
  const first = order.name.split(" ")[0];
  return (
    <div className={`toast-in rounded-lg bg-ink px-4 py-3 text-sm text-white shadow-lg ${className}`}>
      <p className="flex items-center gap-2 font-semibold">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        Text sent to {first}
      </p>
      <p className="mt-1 text-white/80">
        Hi {first}, your order #{order.no} is out for delivery. Track it: ceyflow.lk/t/{order.no}
      </p>
    </div>
  );
}

export function HeroBoard() {
  const { step, live, stages, last, sms } = useBoardLoop();
  const slots = stages.map((s, i) => stages.slice(0, i).filter((x) => x === s).length);
  const instant = live && step === 0; // snap back to the start without sliding
  const focus = last >= 0 ? last : 2;
  const label = "Example: an order moves across the board to Out for delivery, and the customer is sent a text.";

  return (
    <div role="img" aria-label={label}>
      {/* Desktop: the full board */}
      <div className="relative hidden md:block">
        <div
          className="relative rounded-l-xl border border-line bg-white p-3 md:border-r-0"
          style={{ height: TOP + 3 * PITCH + 18 }}
        >
          <div className="grid h-full grid-cols-4 gap-3" aria-hidden="true">
            {STAGES.map((name, si) => (
              <div key={name} className="rounded-md bg-mist">
                <div className="flex h-11 items-center justify-between px-3 text-[13px] font-semibold text-ink">
                  <span className="flex items-center gap-1.5">
                    {si === 3 && <span className="h-2 w-2 rounded-full bg-accent" />}
                    {name}
                  </span>
                  <span className="tabular-nums text-slate-500">{stages.filter((x) => x === si).length}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-3" aria-hidden="true">
            {ORDERS.map((o, i) => (
              <article
                key={o.no}
                className="ticket absolute top-0 left-0 overflow-hidden text-left shadow-sm"
                style={{
                  height: CARD_H,
                  width: "calc((100% - 36px) / 4)",
                  transform: `translate(calc(${stages[i]} * (100% + 12px)), ${TOP - 12 + slots[i] * PITCH}px)`,
                  transition: instant ? "none" : "transform 700ms cubic-bezier(0.3, 0.7, 0.2, 1)",
                }}
              >
                <div className="ticket-head flex items-center justify-between px-3 py-1.5 text-[12px]">
                  <span className="font-bold text-ink tabular-nums">#{o.no}</span>
                  <span className="truncate pl-2 text-slate-500">{o.city}</span>
                </div>
                <div className="px-3 pt-1.5 text-[13px] leading-snug">
                  <p className="truncate font-semibold text-ink">{o.name}</p>
                  <p className="truncate text-slate-500">{o.item}</p>
                </div>
                {live && i === last && <span key={step} className="flash-ring pointer-events-none absolute inset-0" />}
              </article>
            ))}
          </div>
        </div>
        {sms && <SmsNote key={step} order={sms} className="absolute right-6 -bottom-12 max-w-[300px]" />}
      </div>

      {/* Phone: follow one order through the four stages */}
      <div className="md:hidden" aria-hidden="true">
        <div className="ticket relative overflow-hidden">
          <div className="ticket-head flex items-center justify-between px-4 py-2 text-sm">
            <span className="font-bold text-ink tabular-nums">#{ORDERS[focus].no}</span>
            <span className="text-slate-500">{ORDERS[focus].city}</span>
          </div>
          <div className="px-4 pt-3 pb-4">
            <p className="font-semibold text-ink">{ORDERS[focus].name}</p>
            <p className="text-sm text-slate-500">{ORDERS[focus].item}</p>
            <ol className="mt-4 grid grid-cols-4 gap-1.5">
              {STAGES.map((name, si) => (
                <li key={name}>
                  <span
                    className={`block h-1.5 rounded-full transition-colors duration-500 ${si <= stages[focus] ? "bg-brand-700" : "bg-line"}`}
                  />
                  <span className={`mt-1.5 block text-[11px] leading-tight ${si === stages[focus] ? "font-semibold text-ink" : "text-slate-500"}`}>
                    {name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {live && last >= 0 && <span key={step} className="flash-ring pointer-events-none absolute inset-0" />}
        </div>
        {sms && <SmsNote key={step} order={sms} className="mt-3" />}
      </div>
    </div>
  );
}
