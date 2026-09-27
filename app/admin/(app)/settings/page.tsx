"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { saveSettings, savePackagePricing, saveBundlePricing } from "../../../../lib/adminData";
import type { Package, Bundle, Settings } from "../../../../lib/publicData";
import { PasswordForm } from "./PasswordForm";

export default function SettingsPage() {
  const [s, setSettings] = useState<Settings>({});
  const [packages, setPackages] = useState<Package[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [saved, setSaved] = useState<string | null>(null);

  async function refresh() {
    const [{ data: settingsRows }, { data: packageRows }, { data: bundleRows }] = await Promise.all([
      supabase.from("settings").select("key, value"),
      supabase.from("packages").select("*").order("sort"),
      supabase.from("bundles").select("*").order("sort"),
    ]);
    if (settingsRows) setSettings(Object.fromEntries(settingsRows.map((r) => [r.key, r.value])));
    if (packageRows) setPackages(packageRows as Package[]);
    if (bundleRows) setBundles(bundleRows as Bundle[]);
  }
  useEffect(() => { refresh(); }, []);

  function flashSaved(what: string) {
    setSaved(what);
    setTimeout(() => setSaved((cur) => (cur === what ? null : cur)), 2000);
  }

  async function handleCompanyDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await saveSettings(Object.fromEntries(fd.entries()) as Record<string, string>);
    await refresh();
    flashSaved("company");
  }

  async function handlePricing(e: React.FormEvent<HTMLFormElement>, kind: "package" | "bundle") {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = Number(fd.get("id"));
    const setup = fd.get("setup_fee") ? Number(fd.get("setup_fee")) : null;
    const monthly = fd.get("monthly_fee") ? Number(fd.get("monthly_fee")) : null;
    if (kind === "package") await savePackagePricing(id, setup, monthly);
    else await saveBundlePricing(id, setup, monthly);
    await refresh();
    flashSaved(`${kind}-${id}`);
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <form onSubmit={handleCompanyDetails} className="card max-w-2xl space-y-4 p-6">
        <p className="font-semibold">Company details (shown on the public site and on documents)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Company name</label><input name="company_name" defaultValue={s.company_name} className="input" /></div>
          <div><label className="label">Currency code</label><input name="currency" defaultValue={s.currency} className="input" /></div>
          <div className="sm:col-span-2"><label className="label">Tagline</label><input name="company_tagline" defaultValue={s.company_tagline} className="input" /></div>
          <div><label className="label">Email</label><input name="company_email" defaultValue={s.company_email} className="input" /></div>
          <div><label className="label">Phone</label><input name="company_phone" defaultValue={s.company_phone} className="input" /></div>
          <div><label className="label">WhatsApp number (digits only, with country code)</label><input name="company_whatsapp" defaultValue={s.company_whatsapp} className="input" /></div>
          <div><label className="label">Address</label><input name="company_address" defaultValue={s.company_address} className="input" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Quotation number prefix</label><input name="quote_prefix" defaultValue={s.quote_prefix} className="input" /></div>
          <div><label className="label">Invoice number prefix</label><input name="invoice_prefix" defaultValue={s.invoice_prefix} className="input" /></div>
        </div>
        <div><label className="label">Bank / payment details (shown on invoices)</label><textarea name="bank_details" defaultValue={s.bank_details} rows={4} className="input" /></div>
        <div><label className="label">Default quotation terms</label><textarea name="quote_terms" defaultValue={s.quote_terms} rows={3} className="input" /></div>
        <div><label className="label">Default invoice terms</label><textarea name="invoice_terms" defaultValue={s.invoice_terms} rows={3} className="input" /></div>
        <button className="btn-primary">{saved === "company" ? "Saved ✓" : "Save company details"}</button>
      </form>

      <div className="card max-w-2xl p-6">
        <p className="mb-4 font-semibold">Package pricing (shown on the public pricing page)</p>
        <div className="space-y-3">
          {packages.map((p) => (
            <form key={p.id} onSubmit={(e) => handlePricing(e, "package")} className="grid grid-cols-3 items-center gap-3 border-b border-slate-100 pb-3 last:border-0">
              <input type="hidden" name="id" value={p.id} />
              <span className="text-sm font-medium">{p.name}</span>
              <input name="setup_fee" type="number" step="any" defaultValue={p.setup_fee ?? ""} placeholder="Setup fee" className="input" />
              <div className="flex gap-2">
                <input name="monthly_fee" type="number" step="any" defaultValue={p.monthly_fee ?? ""} placeholder="Monthly fee" className="input" />
                <button className="btn-secondary btn-sm shrink-0">{saved === `package-${p.id}` ? "Saved ✓" : "Save"}</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className="card max-w-2xl p-6">
        <p className="mb-4 font-semibold">Bundle pricing</p>
        <div className="space-y-3">
          {bundles.map((b) => (
            <form key={b.id} onSubmit={(e) => handlePricing(e, "bundle")} className="grid grid-cols-3 items-center gap-3 border-b border-slate-100 pb-3 last:border-0">
              <input type="hidden" name="id" value={b.id} />
              <span className="text-sm font-medium">{b.name}</span>
              <input name="setup_fee" type="number" step="any" defaultValue={b.setup_fee ?? ""} placeholder="Setup fee" className="input" />
              <div className="flex gap-2">
                <input name="monthly_fee" type="number" step="any" defaultValue={b.monthly_fee ?? ""} placeholder="Monthly fee" className="input" />
                <button className="btn-secondary btn-sm shrink-0">{saved === `bundle-${b.id}` ? "Saved ✓" : "Save"}</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <PasswordForm />
    </div>
  );
}
