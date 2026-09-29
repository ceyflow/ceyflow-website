export type ShowcaseNavItem = { href: string; label: string; icon: string };

export const SHOWCASE_NAV: ShowcaseNavItem[] = [
  { href: "", label: "Dashboard", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/orders", label: "Orders", icon: "M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" },
  { href: "/customers", label: "Customers", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
];
