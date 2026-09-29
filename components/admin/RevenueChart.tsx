import { money } from "../../lib/format";

export function RevenueChart({ data, currency }: { data: { label: string; value: number }[]; currency: string }) {
  const w = 600;
  const h = 200;
  const padX = 8;
  const padBottom = 22;
  const max = Math.max(1, ...data.map((d) => d.value));
  const slot = data.length ? (w - padX * 2) / data.length : 0;
  const barW = Math.max(4, slot * 0.55);

  if (data.every((d) => d.value === 0)) {
    return <p className="flex h-40 items-center justify-center text-sm text-slate-400">No revenue in this period yet.</p>;
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none" role="img" aria-label="Revenue over time">
      {data.map((d, i) => {
        const barH = (d.value / max) * (h - padBottom - 10);
        const x = padX + i * slot + (slot - barW) / 2;
        const y = h - padBottom - barH;
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={y} width={barW} height={Math.max(2, barH)} rx="3" className="fill-brand-600">
              <title>{`${d.label}: ${money(d.value, currency)}`}</title>
            </rect>
            <text x={x + barW / 2} y={h - 6} textAnchor="middle" className="fill-slate-400 text-[9px]">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
