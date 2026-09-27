"use client";
import Link from "next/link";
import { Logo } from "./Logo";
import { useSettings } from "../lib/publicData";

export function SiteFooter() {
  const s = useSettings();
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-3 max-w-sm text-sm text-brand-200/80">{s.company_tagline}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Explore</p>
          <ul className="space-y-2 text-brand-200/80">
            <li><Link href="/systems" className="hover:text-white">Systems</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/about" className="hover:text-white">About us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Talk to us</p>
          <ul className="space-y-2 text-brand-200/80">
            <li><a href={`mailto:${s.company_email}`} className="hover:text-white">{s.company_email}</a></li>
            <li><a href={`tel:${s.company_phone.replace(/\s/g, "")}`} className="hover:text-white">{s.company_phone}</a></li>
            <li>{s.company_address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-200/60">
        © {new Date().getFullYear()} {s.company_name}. All rights reserved.
      </div>
    </footer>
  );
}
