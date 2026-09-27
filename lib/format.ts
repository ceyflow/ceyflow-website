export function money(n: number | null | undefined, currency = "LKR") {
  if (n === null || n === undefined) return "";
  return `${currency} ${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function shortMoney(n: number | null | undefined, currency = "LKR") {
  if (n === null || n === undefined) return "";
  return `${currency} ${n.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

export function date(d: string | null | undefined) {
  if (!d) return "";
  const dt = new Date(d.length === 10 ? d + "T00:00:00" : d.replace(" ", "T") + (d.includes("Z") ? "" : "Z"));
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const QUOTE_STATUSES = ["draft", "sent", "accepted", "declined", "expired"] as const;
export const INVOICE_STATUSES = ["draft", "sent", "partially paid", "paid", "void"] as const;
