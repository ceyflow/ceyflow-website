export type AdminNavItem = { href: string; label: string; icon: string; badgeKey?: "inquiries" | "invoices" };

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "", label: "Dashboard", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/inquiries", label: "Inquiries", icon: "M4 5h16v11H8l-4 4z", badgeKey: "inquiries" },
  { href: "/quotes", label: "Quotations", icon: "M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" },
  { href: "/invoices", label: "Invoices", icon: "M6 3h9l3 3v15H6zM9 12h6M9 16h6M12 8v0", badgeKey: "invoices" },
  { href: "/clients", label: "Clients", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
  { href: "/reports", label: "Reports", icon: "M4 20h16M7 20V10M12 20V4M17 20v-7" },
  { href: "/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.3.9a7 7 0 00-2-1.2L14 3h-4l-.6 2.5a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.6a7 7 0 000 2.4l-2 1.6 2 3.4 2.3-.9a7 7 0 002 1.2L10 21h4l.6-2.5a7 7 0 002-1.2l2.3.9 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z" },
];

/** Bottom tab bar on mobile shows 4 primary items; the rest live under "More". */
export const MOBILE_TAB_HREFS = ["", "/inquiries", "/invoices", "/clients"];
