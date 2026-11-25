"use client";
import Link from "next/link";
import { Logo } from "./Logo";
import { useSettings } from "../lib/publicData";

export function SiteFooter() {
  const s = useSettings();
  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed">{s.company_tagline}</p>
        </div>
        <nav aria-label="Footer" className="text-[15px] md:col-span-3 md:col-start-7">
          <p className="mb-3 font-semibold text-white">Explore</p>
          <ul className="space-y-2.5">
            <li><Link href="/systems" className="hover:text-white">Systems</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/about" className="hover:text-white">About us</Link></li>
            <li><Link href="/showcase#sample" className="hover:text-white">Live demo</Link></li>
          </ul>
        </nav>
        <div className="text-[15px] md:col-span-3">
          <p className="mb-3 font-semibold text-white">Talk to us</p>
          <ul className="space-y-2.5">
            <li><a href={`mailto:${s.company_email}`} className="break-all hover:text-white">{s.company_email}</a></li>
            <li><a href={`tel:${s.company_phone.replace(/\s/g, "")}`} className="hover:text-white">{s.company_phone}</a></li>
            {s.company_whatsapp && (
              <li><a href={`https://wa.me/${s.company_whatsapp}`} className="hover:text-white">WhatsApp</a></li>
            )}
            <li>{s.company_address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[13px] text-white/50">
        © {new Date().getFullYear()} {s.company_name}. All rights reserved.
      </div>
    </footer>
  );
}
