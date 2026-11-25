"use client";
import { useSearchParams } from "next/navigation";
import { useBundles, usePackages, useSettings } from "../../../lib/publicData";
import { ContactForm } from "./ContactForm";

export function ContactClient() {
  const params = useSearchParams();
  const interest = params.get("interest") || "";
  const message = params.get("message") || "";
  const s = useSettings();
  const bundles = useBundles();
  const packages = usePackages();
  const options = [...bundles.map((b) => `${b.name} bundle`), ...packages.map((p) => p.name), "Custom system"];
  if (interest && !options.includes(interest)) options.unshift(interest);

  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-5 md:py-20">
        <div className="md:col-span-2">
          <h1 className="display text-6xl md:text-7xl">Let&rsquo;s talk</h1>
          <p className="mt-4 text-lg text-slate-600">
            Tell us a little about your business. We will reply within one working day to set up a free discovery call.
          </p>
          <ul className="mt-8 space-y-5 text-base">
            <li><p className="font-bold">Email</p><a className="font-semibold text-brand-700 hover:underline" href={`mailto:${s.company_email}`}>{s.company_email}</a></li>
            <li><p className="font-bold">Phone</p><a className="font-semibold text-brand-700 hover:underline" href={`tel:${s.company_phone.replace(/\s/g, "")}`}>{s.company_phone}</a></li>
            {s.company_whatsapp && (
              <li><p className="font-bold">WhatsApp</p><a className="font-semibold text-brand-700 hover:underline" href={`https://wa.me/${s.company_whatsapp}`}>Message us on WhatsApp</a></li>
            )}
            <li><p className="font-bold">Location</p><p className="text-slate-600">{s.company_address}</p></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <ContactForm interest={interest} message={message} options={options} />
        </div>
      </div>
    </section>
  );
}
