// In-memory, fictional data for the /showcase product demo — a stand-in "small
// retail business" (Lakview Traders) used to show prospects what Ceyflow's
// order + delivery + SMS system looks like in real use. Nothing here is real:
// no real business, customer, courier or SMS provider is named or modeled.
// State lives only in this module (resets on every full page load) — there is
// no backend, so there's nothing to seed, reset, or accidentally leak.

export type OrderStage = 0 | 1 | 2 | 3;

export const ORDER_STAGES: { key: OrderStage; label: string }[] = [
  { key: 0, label: "Order received" },
  { key: 1, label: "Processing" },
  { key: 2, label: "Invoicing & checking" },
  { key: 3, label: "Picked up by delivery" },
];

export const STAGE_COLORS: Record<OrderStage, { text: string; bg: string; dot: string }> = {
  0: { text: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
  1: { text: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
  2: { text: "text-violet-700", bg: "bg-violet-100", dot: "bg-violet-500" },
  3: { text: "text-emerald-700", bg: "bg-emerald-100", dot: "bg-emerald-500" },
};

export type Priority = "Low" | "Medium" | "High";

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-rose-100 text-rose-700",
};

export type ShowcaseOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  product: string;
  qty: number;
  priority: Priority;
  stage: OrderStage;
  trackingNumber: string | null;
  createdAt: string;
  history: { stage: OrderStage; at: string }[];
  notes: string;
  rating: number | null;
};

export type ShowcaseCustomer = {
  id: number;
  name: string;
  phone: string;
  city: string;
  totalOrders: number;
};

export const COURIER_NAME = "Zipline Express";
export const BUSINESS_NAME = "Lakview Traders";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SEED_CUSTOMERS: ShowcaseCustomer[] = [
  { id: 1, name: "Nadeesha Fernando", phone: "071 442 0198", city: "Nugegoda", totalOrders: 4 },
  { id: 2, name: "Ruwan Perera", phone: "077 218 5563", city: "Kandy", totalOrders: 2 },
  { id: 3, name: "Sanduni Jayasuriya", phone: "070 655 3341", city: "Galle", totalOrders: 6 },
  { id: 4, name: "Amal Wickramasinghe", phone: "076 903 7724", city: "Colombo 5", totalOrders: 1 },
  { id: 5, name: "Tharindu Gunawardena", phone: "071 320 8856", city: "Negombo", totalOrders: 3 },
  { id: 6, name: "Malithi Silva", phone: "077 561 0942", city: "Kurunegala", totalOrders: 2 },
];

const SEED_ORDERS: ShowcaseOrder[] = [
  {
    id: 1, orderNumber: "LT-1042", customerName: "Nadeesha Fernando", phone: "071 442 0198", address: "24/3 Lake Road, Nugegoda",
    product: "Gift hamper — Classic (large)", qty: 1, priority: "High", stage: 3, trackingNumber: "ZE88213940",
    createdAt: daysAgo(2), notes: "Customer asked for delivery after 5pm.",
    history: [{ stage: 0, at: daysAgo(2) }, { stage: 1, at: daysAgo(2) }, { stage: 2, at: daysAgo(1) }, { stage: 3, at: daysAgo(0) }],
    rating: 5,
  },
  {
    id: 2, orderNumber: "LT-1043", customerName: "Ruwan Perera", phone: "077 218 5563", address: "112 Peradeniya Rd, Kandy",
    product: "Ceramic dinner set (4-seat)", qty: 1, priority: "Medium", stage: 2, trackingNumber: null,
    createdAt: daysAgo(1), notes: "",
    history: [{ stage: 0, at: daysAgo(1) }, { stage: 1, at: daysAgo(1) }, { stage: 2, at: daysAgo(0) }],
    rating: null,
  },
  {
    id: 3, orderNumber: "LT-1044", customerName: "Sanduni Jayasuriya", phone: "070 655 3341", address: "9 Church St, Galle Fort",
    product: "Table lamp — Rattan", qty: 2, priority: "Low", stage: 1, trackingNumber: null,
    createdAt: daysAgo(1), notes: "Repeat customer — 6th order.",
    history: [{ stage: 0, at: daysAgo(1) }, { stage: 1, at: daysAgo(0) }],
    rating: null,
  },
  {
    id: 4, orderNumber: "LT-1045", customerName: "Amal Wickramasinghe", phone: "076 903 7724", address: "56 Havelock Rd, Colombo 5",
    product: "Cushion cover set (3pc)", qty: 1, priority: "Medium", stage: 0, trackingNumber: null,
    createdAt: daysAgo(0), notes: "",
    history: [{ stage: 0, at: daysAgo(0) }],
    rating: null,
  },
  {
    id: 5, orderNumber: "LT-1046", customerName: "Tharindu Gunawardena", phone: "071 320 8856", address: "3rd Lane, Negombo",
    product: "Gift hamper — Deluxe", qty: 1, priority: "High", stage: 0, trackingNumber: null,
    createdAt: daysAgo(0), notes: "Birthday gift — needs to arrive by Friday.",
    history: [{ stage: 0, at: daysAgo(0) }],
    rating: null,
  },
  {
    id: 6, orderNumber: "LT-1041", customerName: "Malithi Silva", phone: "077 561 0942", address: "Dambulla Rd, Kurunegala",
    product: "Wall clock — Walnut", qty: 1, priority: "Low", stage: 3, trackingNumber: "ZE88209117",
    createdAt: daysAgo(4), notes: "",
    history: [{ stage: 0, at: daysAgo(4) }, { stage: 1, at: daysAgo(4) }, { stage: 2, at: daysAgo(3) }, { stage: 3, at: daysAgo(2) }],
    rating: 4,
  },
  {
    id: 7, orderNumber: "LT-1040", customerName: "Sanduni Jayasuriya", phone: "070 655 3341", address: "9 Church St, Galle Fort",
    product: "Ceramic dinner set (6-seat)", qty: 1, priority: "Medium", stage: 3, trackingNumber: "ZE88201872",
    createdAt: daysAgo(5), notes: "",
    history: [{ stage: 0, at: daysAgo(5) }, { stage: 1, at: daysAgo(5) }, { stage: 2, at: daysAgo(4) }, { stage: 3, at: daysAgo(3) }],
    rating: null,
  },
];

type Listener = () => void;

class ShowcaseStore {
  private orders: ShowcaseOrder[] = SEED_ORDERS.map((o) => ({ ...o, history: [...o.history] }));
  private listeners = new Set<Listener>();
  private nextId = SEED_ORDERS.length + 1;

  private emit() {
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getOrders = (): ShowcaseOrder[] => this.orders;

  getOrder = (id: number): ShowcaseOrder | undefined => this.orders.find((o) => o.id === id);

  findByNumberOrPhone = (query: string): ShowcaseOrder | undefined => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return this.orders.find(
      (o) => o.orderNumber.toLowerCase() === q || o.orderNumber.toLowerCase() === `lt-${q}` || o.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
    );
  };

  advanceStage = (id: number): { order: ShowcaseOrder; smsSent: boolean } | null => {
    const order = this.orders.find((o) => o.id === id);
    if (!order || order.stage >= 3) return null;
    const nextStage = (order.stage + 1) as OrderStage;
    order.stage = nextStage;
    order.history = [...order.history, { stage: nextStage, at: new Date().toISOString() }];
    if (nextStage === 3 && !order.trackingNumber) {
      order.trackingNumber = "ZE" + Math.floor(88200000 + Math.random() * 99999);
    }
    this.orders = [...this.orders];
    this.emit();
    const smsSent = nextStage === 1 || nextStage === 3;
    return { order, smsSent };
  };

  rateOrder = (id: number, rating: number) => {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return;
    order.rating = rating;
    this.orders = [...this.orders];
    this.emit();
  };

  addOrder = (input: Pick<ShowcaseOrder, "customerName" | "phone" | "address" | "product" | "qty" | "priority" | "notes">) => {
    const order: ShowcaseOrder = {
      id: this.nextId++,
      orderNumber: "LT-" + (1046 + this.nextId),
      stage: 0,
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      history: [{ stage: 0, at: new Date().toISOString() }],
      rating: null,
      ...input,
    };
    this.orders = [order, ...this.orders];
    this.emit();
    return order;
  };

  getCustomers = (): ShowcaseCustomer[] => SEED_CUSTOMERS;
}

export const showcaseStore = new ShowcaseStore();

export function smsTemplateFor(order: ShowcaseOrder, stage: OrderStage): string {
  if (stage === 1) {
    return `Hi ${order.customerName.split(" ")[0]}, your ${BUSINESS_NAME} order ${order.orderNumber} is now processing! We'll text you again once it's out for delivery.`;
  }
  if (stage === 3) {
    return `Hi ${order.customerName.split(" ")[0]}, your ${BUSINESS_NAME} order ${order.orderNumber} has been picked up by ${COURIER_NAME}! Track it live: lakview.demo/track/${order.orderNumber}`;
  }
  return "";
}
