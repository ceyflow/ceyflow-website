const STEPS: Record<string, string[]> = {
  invoice: ["draft", "sent", "partially paid", "paid"],
  quote: ["draft", "sent", "accepted"],
};

export function StatusStepper({ type, status }: { type: "invoice" | "quote"; status: string }) {
  const steps = STEPS[type];
  if (status === "void" || status === "declined" || status === "expired") {
    return <p className="text-xs font-semibold capitalize text-slate-500">{status}</p>;
  }
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => {
        const done = currentIndex >= 0 && i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${done ? "bg-brand-700" : active ? "bg-accent" : "bg-slate-200"}`} />
              <span className={`text-xs capitalize ${active ? "font-semibold text-brand-700" : done ? "text-slate-600" : "text-slate-400"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <span className="h-px w-4 bg-slate-200" />}
          </div>
        );
      })}
    </div>
  );
}
