"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "../../../lib/authClient";
import { getInquiries, getDocuments } from "../../../lib/adminData";
import { isOverdue } from "../../../lib/format";
import { Logo } from "../../../components/Logo";
import { ADMIN_NAV } from "../../../lib/adminNav";
import { MobileTabBar } from "../../../components/admin/MobileTabBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const router = useRouter();
  const [newInquiries, setNewInquiries] = useState(0);
  const [overdueInvoices, setOverdueInvoices] = useState(0);

  useEffect(() => {
    if (!loading && !session) router.replace("/admin/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    getInquiries().then((rows) => setNewInquiries(rows.filter((i) => i.status === "new").length)).catch(() => {});
    getDocuments("invoice").then((rows) => setOverdueInvoices(rows.filter(isOverdue).length)).catch(() => {});
  }, [session]);

  if (loading || !session) return null;

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/login");
  }

  const name = (session.user.user_metadata?.name as string | undefined) || session.user.email || "";
  const badgeCounts = { inquiries: newInquiries, invoices: overdueInvoices };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="no-print hidden flex-none flex-col border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-56 md:self-start md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/admin"><Logo /></Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
          {ADMIN_NAV.map((n) => (
            <Link key={n.href} href={`/admin${n.href}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700">
              <svg className="h-4.5 w-4.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              <span className="whitespace-nowrap">{n.label}</span>
              {n.badgeKey && badgeCounts[n.badgeKey] > 0 && (
                <span className="ml-auto rounded-full bg-brand-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">{badgeCounts[n.badgeKey]}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-sm font-medium text-slate-700">{name}</p>
          <p className="truncate text-xs text-slate-500">{session.user.email}</p>
          <div className="mt-3 flex gap-2">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-800">View site</Link>
            <button onClick={handleSignOut} className="ml-auto text-xs font-medium text-red-600 hover:text-red-700">Sign out</button>
          </div>
        </div>
      </aside>
      <header className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link href="/admin"><Logo /></Link>
        <button onClick={handleSignOut} className="text-xs font-medium text-red-600 hover:text-red-700">Sign out</button>
      </header>
      <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      <MobileTabBar
        base="/admin"
        badgeCounts={badgeCounts}
        footer={
          <div className="flex items-center justify-between px-1">
            <Link href="/" className="text-sm font-medium text-slate-500">View site</Link>
            <button onClick={handleSignOut} className="text-sm font-medium text-red-600">Sign out</button>
          </div>
        }
      />
    </div>
  );
}
