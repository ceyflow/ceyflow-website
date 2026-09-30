export type ShowcaseNavItem = { href: string; label: string; icon: string };

export const SHOWCASE_NAV: ShowcaseNavItem[] = [
  { href: "", label: "Dashboard", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/orders", label: "Orders", icon: "M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" },
  { href: "/production", label: "Batches", icon: "M4 7l8-4 8 4-8 4-8-4zM4 7v10l8 4 8-4V7M4 7l8 4 8-4" },
  { href: "/customers", label: "Customers", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
  { href: "/complaints", label: "Complaints", icon: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" },
  { href: "/chat", label: "Chat", icon: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" },
  { href: "/staff", label: "Staff", icon: "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M11 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
];
