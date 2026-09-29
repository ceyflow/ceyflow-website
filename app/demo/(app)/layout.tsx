"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/demo", label: "Dashboard", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/demo/quotes", label: "Quotations", icon: "M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" },
  { href: "/demo/invoices", label: "Invoices", icon: "M6 3h9l3 3v15H6zM9 12h6M9 16h6M12 8v0" },
  { href: "/demo/clients", label: "Clients", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
  { href: "/demo/inquiries", label: "Inquiries", icon: "M4 5h16v11H8l-4 4z" },
  { href: "/demo/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.3.9a7 7 0 00-2-1.2L14 3h-4l-.6 2.5a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.6a7 7 0 000 2.4l-2 1.6 2 3.4 2.3-.9a7 7 0 002 1.2L10 21h4l.6-2.5a7 7 0 002-1.2l2.3.9 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z" },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="no-print flex flex-none flex-col border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-56 md:self-start md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/demo"><Logo /></Link>
        </div>
        <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible md:py-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700">
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
      <main className="flex-1 p-4 md:p-8">
        <div className="no-print mb-6 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-800">
          <span className="font-semibold">Demo mode</span>
          <span className="text-brand-700">— explore freely, nothing you enter here is saved or visible to anyone else.</span>
        </div>
        {children}
      </main>
    </div>
  );
}
