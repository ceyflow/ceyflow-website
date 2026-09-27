import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, logout } from "../../../lib/actions";
import { getInquiries } from "../../../lib/db";
import { Logo } from "../../../components/Logo";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/admin/quotes", label: "Quotations", icon: "M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" },
  { href: "/admin/invoices", label: "Invoices", icon: "M6 3h9l3 3v15H6zM9 12h6M9 16h6M12 8v0" },
  { href: "/admin/clients", label: "Clients", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "M4 5h16v11H8l-4 4z" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.3.9a7 7 0 00-2-1.2L14 3h-4l-.6 2.5a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.6a7 7 0 000 2.4l-2 1.6 2 3.4 2.3-.9a7 7 0 002 1.2L10 21h4l.6-2.5a7 7 0 002-1.2l2.3.9 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const newInquiries = getInquiries().filter((i) => i.status === "new").length;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="no-print flex flex-none flex-col border-b border-slate-200 bg-white md:h-screen md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/admin"><Logo /></Link>
        </div>
        <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible md:py-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700">
              <svg className="h-4.5 w-4.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              <span className="whitespace-nowrap">{n.label}</span>
              {n.href === "/admin/inquiries" && newInquiries > 0 && (
                <span className="ml-auto rounded-full bg-brand-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">{newInquiries}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-sm font-medium text-slate-700">{session.name}</p>
          <p className="truncate text-xs text-slate-500">{session.email}</p>
          <div className="mt-3 flex gap-2">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-800">View site</Link>
            <form action={logout} className="ml-auto"><button className="text-xs font-medium text-red-600 hover:text-red-700">Sign out</button></form>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
