// What the customer receives: a text message, and the tracking page it links to.
// Static and fictional ("Lakview Traders" is the demo business).

const STEPS: { label: string; time: string; state: "done" | "now" | "next" }[] = [
  { label: "Order placed", time: "Mon, 9:12 am", state: "done" },
  { label: "Packed and checked", time: "Mon, 2:40 pm", state: "done" },
  { label: "Picked up by the courier", time: "Tue, 10:05 am", state: "done" },
  { label: "Out for delivery", time: "Tue, 1:30 pm", state: "now" },
  { label: "Delivered", time: "", state: "next" },
];

export function TrackTicket() {
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-start">
      <div className="rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3 text-[15px] leading-snug text-ink sm:mt-10">
        <p className="text-xs font-semibold text-slate-500">Lakview Traders · text message</p>
        <p className="mt-1.5">
          Hi Nadeesha, your Lakview Traders order #1042 is out for delivery. Track it live: lakview.demo/track/1042
        </p>
      </div>

      <div className="ticket overflow-hidden">
        <div className="ticket-head flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="font-bold text-ink tabular-nums">Order #1042</span>
          <span className="text-slate-500">Colombo 05</span>
        </div>
        <ol className="px-4 py-4">
          {STEPS.map((s, i) => (
            <li key={s.label} className="relative flex gap-3 pb-4 last:pb-0">
              {i < STEPS.length - 1 && (
                <span
                  className={`absolute top-4 left-[7px] h-full w-px ${s.state === "done" ? "bg-brand-700" : "bg-line"}`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative mt-1 h-[15px] w-[15px] flex-none rounded-full border-2 ${
                  s.state === "done"
                    ? "border-brand-700 bg-brand-700"
                    : s.state === "now"
                      ? "border-accent bg-white ring-4 ring-accent/25"
                      : "border-line bg-white"
                }`}
                aria-hidden="true"
              />
              <div className="flex flex-1 items-baseline justify-between gap-3">
                <p className={`text-[15px] ${s.state === "next" ? "text-slate-400" : "font-semibold text-ink"}`}>{s.label}</p>
                {s.time && <p className="flex-none text-[13px] text-slate-500 tabular-nums">{s.time}</p>}
              </div>
            </li>
          ))}
        </ol>
        <p className="border-t border-dashed border-[#b9c1d6] px-4 py-2.5 text-[13px] text-slate-500">
          Courier tracking number ZE88201455
        </p>
      </div>
    </div>
  );
}
