"use client";
import Link from "next/link";
import { SHOWCASE_NAV } from "@/lib/showcaseNav";
import { ShowcaseTabBar } from "@/components/showcase/ShowcaseTabBar";
import { BUSINESS_NAME } from "@/lib/showcaseData";

export default function ShowcaseStaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="hidden flex-none flex-col border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-56 md:self-start md:border-r">
        <div className="flex items-center gap-2 px-5 py-4">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-indigo-600 font-display text-sm font-bold text-white">L</span>
          <span className="truncate font-display text-sm font-bold text-slate-900">{BUSINESS_NAME}</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
          {SHOWCASE_NAV.map((n) => (
            <Link key={n.href} href={`/showcase${n.href}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">
              <svg className="h-4.5 w-4.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              <span className="whitespace-nowrap">{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-xs text-slate-500">Operations console</p>
          <a href="https://ceyflow.github.io/ceyflow-website/" target="_blank" rel="noreferrer" className="mt-2 block text-xs font-medium text-indigo-600 hover:text-indigo-800">Built by Ceyflow ↗</a>
        </div>
      </aside>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-indigo-600 font-display text-xs font-bold text-white">L</span>
          <span className="font-display text-sm font-bold text-slate-900">{BUSINESS_NAME}</span>
        </span>
        <a href="https://ceyflow.github.io/ceyflow-website/" target="_blank" rel="noreferrer" className="text-[11px] font-medium text-indigo-600">Built by Ceyflow ↗</a>
      </header>
      <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      <ShowcaseTabBar base="/showcase" />
    </div>
  );
}
