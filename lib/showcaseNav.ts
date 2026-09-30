export type ShowcaseNavItem = { href: string; label: string; icon: string };

export const SHOWCASE_NAV: ShowcaseNavItem[] = [
  { href: "", label: "Dashboard", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/orders", label: "Orders", icon: "M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" },
  { href: "/customers", label: "Customers", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
  { href: "/complaints", label: "Complaints", icon: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" },
];
