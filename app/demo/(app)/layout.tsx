"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ADMIN_NAV } from "@/lib/adminNav";
import { MobileTabBar } from "@/components/admin/MobileTabBar";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="no-print hidden flex-none flex-col border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-56 md:self-start md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/demo"><Logo /></Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
          {ADMIN_NAV.map((n) => (
            <Link key={n.href} href={`/demo${n.href}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700">
              <svg className="h-4.5 w-4.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              <span className="whitespace-nowrap">{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-sm font-medium text-slate-700">Demo Account</p>
          <p className="truncate text-xs text-slate-500">Nothing here is saved or shared</p>
          <div className="mt-3">
            <a href="/" className="text-xs font-medium text-slate-500 hover:text-slate-800">← Exit demo</a>
          </div>
        </div>
      </aside>
      <header className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link href="/demo"><Logo /></Link>
        <a href="/" className="text-xs font-medium text-slate-500">← Exit demo</a>
      </header>
      <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">
        <div className="no-print mb-6 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-800">
          <span className="font-semibold">Demo mode</span>
          <span className="text-brand-700">— explore freely, nothing you enter here is saved or visible to anyone else.</span>
        </div>
        {children}
      </main>
      <MobileTabBar
        base="/demo"
        footer={
          <div className="px-1">
            <a href="/" className="text-sm font-medium text-slate-500">← Exit demo</a>
          </div>
        }
      />
    </div>
  );
}
