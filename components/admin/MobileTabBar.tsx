"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ADMIN_NAV, MOBILE_TAB_HREFS } from "../../lib/adminNav";

export function MobileTabBar({
  base, badgeCounts, footer,
}: {
  base: string;
  badgeCounts?: Partial<Record<"inquiries" | "invoices", number>>;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tabs = ADMIN_NAV.filter((n) => MOBILE_TAB_HREFS.includes(n.href));
  const moreItems = ADMIN_NAV.filter((n) => !MOBILE_TAB_HREFS.includes(n.href));

  function isActive(href: string) {
    const full = `${base}${href}`;
    return href === "" ? pathname === base || pathname === `${base}/` : pathname === full || pathname.startsWith(`${full}/`);
  }

  return (
    <>
      <nav className="no-print fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden">
        {tabs.map((n) => (
          <Link
            key={n.href || "home"}
            href={`${base}${n.href}`}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive(n.href) ? "text-brand-700" : "text-slate-400"}`}
          >
            <span className="relative">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              {n.badgeKey && badgeCounts?.[n.badgeKey] ? (
                <span className="absolute -right-1.5 -top-1 rounded-full bg-brand-600 px-1 text-[9px] font-semibold text-white">{badgeCounts[n.badgeKey]}</span>
              ) : null}
            </span>
            {n.label}
          </Link>
        ))}
        <button onClick={() => setOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-slate-400">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
          More
        </button>
      </nav>
      {open && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
            <div className="space-y-1">
              {moreItems.map((n) => (
                <Link
                  key={n.href}
                  href={`${base}${n.href}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50"
                >
                  <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
                  {n.label}
                </Link>
              ))}
            </div>
            {footer && <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div>}
          </div>
        </div>
      )}
    </>
  );
}
