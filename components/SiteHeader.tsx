import Link from "next/link";
import { Logo } from "./Logo";

const links = [
  { href: "/systems", label: "Systems" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/"><Logo /></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-700">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-800">Login</Link>
          <Link href="/contact" className="btn-primary">Book a free call</Link>
        </div>
      </div>
      <nav className="flex justify-center gap-5 border-t border-slate-100 py-2 text-sm font-medium text-slate-600 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>{l.label}</Link>
        ))}
      </nav>
    </header>
  );
}
