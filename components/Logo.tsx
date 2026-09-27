"use client";
import { useSettings } from "../lib/publicData";

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const s = useSettings();
  const custom = light ? s.logo_dark_bg : s.logo_light_bg;

  if (custom) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={custom} alt={s.company_name || "Ceyflow"} className="h-8 w-auto object-contain" />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md bg-white p-1 ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ceyflow-mark.png" alt="" className="h-full w-full object-contain" width={1202} height={1101} />
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light ? "/ceyflow-wordmark-white.png" : "/ceyflow-wordmark.png"}
        alt="Ceyflow"
        className="h-5 w-auto"
        width={1787}
        height={515}
      />
    </span>
  );
}
