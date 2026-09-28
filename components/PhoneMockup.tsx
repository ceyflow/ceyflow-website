export function PhoneMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[220px] rounded-[2.25rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl shadow-brand-900/20 ${className}`}>
      <div className="absolute top-0 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-slate-900" />
      <div className="overflow-hidden rounded-[1.6rem] bg-white" style={{ aspectRatio: "9 / 19.5" }}>
        {children}
      </div>
    </div>
  );
}

export function PhoneScreenSms() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-600 to-brand-900 px-3 pt-8">
      <div className="text-center text-[10px] font-medium text-white/70">9:41</div>
      <div className="animate-sms-pop mt-8 rounded-xl bg-white/95 p-2.5 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-700 text-[9px] font-bold text-white">C</span>
          <p className="text-[10px] font-semibold text-slate-800">Ceyflow · now</p>
        </div>
        <p className="mt-1 text-[10px] leading-snug text-slate-600">
          Hi Nadeesha, your order #1042 is out for delivery 🚚 Track: ceyflow.lk/t/1042
        </p>
      </div>
    </div>
  );
}

export function PhoneScreenTracking() {
  const steps = ["Order placed", "Packed", "Out for delivery", "Delivered"];
  const current = 2;
  return (
    <div className="flex h-full flex-col bg-white px-3 pt-8">
      <p className="text-[11px] font-semibold text-slate-800">Order #1042</p>
      <p className="text-[9px] text-slate-400">Live tracking</p>
      <div
        className="relative mt-2 h-20 overflow-hidden rounded-lg bg-brand-50 ring-1 ring-brand-100"
        style={{ backgroundImage: "radial-gradient(circle, var(--color-brand-200) 1px, transparent 1px)", backgroundSize: "10px 10px" }}
      >
        <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-700">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-500" />
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 flex-none rounded-full ${i <= current ? "bg-brand-700" : "bg-slate-200"}`} />
            <span className={`text-[10px] ${i <= current ? "font-semibold text-slate-800" : "text-slate-400"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
