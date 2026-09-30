"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SHOWCASE_NAV } from "@/lib/showcaseNav";

export function ShowcaseTabBar({ base }: { base: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    const full = `${base}${href}`;
    return href === "" ? pathname === base || pathname === `${base}/` : pathname === full || pathname.startsWith(`${full}/`);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex overflow-x-auto border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden">
      {SHOWCASE_NAV.map((n) => (
        <Link
          key={n.href || "home"}
          href={`${base}${n.href}`}
          className={`flex w-16 flex-none flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${isActive(n.href) ? "text-indigo-700" : "text-slate-400"}`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
          <span className="whitespace-nowrap">{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}
