"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/systems", label: "Systems" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" onClick={close} aria-label="Ceyflow home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-semibold text-ink md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-700">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/showcase#sample" className="hidden text-[15px] font-semibold text-brand-700 hover:underline md:inline">Live demo</Link>
          <Link href="/admin" className="hidden text-[15px] font-medium text-slate-500 hover:text-ink md:inline">Login</Link>
          <Link href="/contact" onClick={close} className="cta cta-sm">Book a free call</Link>
          <button
            type="button"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-line bg-white px-4 pb-4 md:hidden">
          <ul className="divide-y divide-line text-[17px] font-semibold text-ink">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} onClick={close} className="block py-3.5">{l.label}</Link></li>
            ))}
            <li><Link href="/showcase#sample" onClick={close} className="block py-3.5 text-brand-700">Live demo</Link></li>
            <li><Link href="/admin" onClick={close} className="block py-3.5 font-medium text-slate-500">Login</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
