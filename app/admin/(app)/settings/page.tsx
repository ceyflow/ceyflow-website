"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { saveSettings, savePackagePricing, saveBundlePricing } from "../../../../lib/adminData";
import type { Package, Bundle, Settings } from "../../../../lib/publicData";
import { PasswordForm } from "./PasswordForm";

// Logos are stored as data URIs directly in the settings table (no Supabase Storage
// bucket needed), so downscale before saving — this table gets fetched on every
// public page load, and an unshrunk phone photo would bloat that badly.
function resizeToDataUrl(file: File, maxDim = 320, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const isPng = file.type === "image/png" || file.type === "image/svg+xml";
      resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
    img.src = url;
  });
}

export default function SettingsPage() {
  const [s, setSettings] = useState<Settings>({});
  const [packages, setPackages] = useState<Package[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [logoBusy, setLogoBusy] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

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

  async function handleLogoUpload(key: "logo_light_bg" | "logo_dark_bg", file: File | undefined) {
    if (!file) return;
    setLogoError(null);
    setLogoBusy(key);
    try {
      const dataUrl = await resizeToDataUrl(file, key === "logo_dark_bg" ? 240 : 320);
      await saveSettings({ [key]: dataUrl });
      await refresh();
    } catch {
      setLogoError("Could not use that image — try a PNG or JPG.");
    } finally {
      setLogoBusy(null);
    }
  }

  async function handleLogoRemove(key: "logo_light_bg" | "logo_dark_bg") {
    setLogoBusy(key);
    await saveSettings({ [key]: "" });
    await refresh();
    setLogoBusy(null);
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

      <div className="card max-w-2xl space-y-5 p-6">
        <div>
          <p className="font-semibold">Logo</p>
          <p className="text-sm text-slate-500">Replaces the Ceyflow logo shown on the website, admin panel, and login page. PNG or JPG, transparent background works best.</p>
        </div>
        {logoError && <p className="text-sm text-red-600">{logoError}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          {([
            { key: "logo_light_bg" as const, label: "Logo (site header, admin, login)", swatch: "bg-white ring-1 ring-slate-200" },
            { key: "logo_dark_bg" as const, label: "Logo (footer — dark background)", swatch: "bg-brand-900" },
          ]).map(({ key, label, swatch }) => (
            <div key={key} className="space-y-2">
              <label className="label">{label}</label>
              <div className={`flex h-16 items-center justify-center rounded-lg ${swatch} p-2`}>
                {s[key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s[key]} alt="" className="h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400">Using default logo</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="btn-secondary btn-sm cursor-pointer">
                  {logoBusy === key ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={logoBusy === key}
                    onChange={(e) => { void handleLogoUpload(key, e.target.files?.[0]); e.target.value = ""; }}
                  />
                </label>
                {s[key] && (
                  <button type="button" onClick={() => handleLogoRemove(key)} disabled={logoBusy === key} className="text-xs font-medium text-red-600 hover:text-red-700">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
