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

export type TeamNote = { id: number; author: string; text: string; at: string };

export const CHECKLIST_LABELS = [
  "Items picked & counted",
  "Quality checked",
  "Packed securely",
  "Invoice printed & attached",
] as const;

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
  checklist: boolean[];
  teamNotes: TeamNote[];
};

export type ShowcaseCustomer = {
  id: number;
  name: string;
  phone: string;
  city: string;
  totalOrders: number;
};

export type StaffMember = { id: number; name: string; role: "Admin" | "Packer" | "Dispatcher" };

export const STAFF_MEMBERS: StaffMember[] = [
  { id: 1, name: "You (Owner)", role: "Admin" },
];

export type ComplaintStatus = "Open" | "In progress" | "Resolved";

export const COMPLAINT_STATUS_COLORS: Record<ComplaintStatus, string> = {
  Open: "bg-rose-100 text-rose-700",
  "In progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

export type ShowcaseComplaint = {
  id: number;
  orderNumber: string | null;
  customerName: string;
  phone: string;
  subject: string;
  details: string;
  status: ComplaintStatus;
  createdAt: string;
  resolution: string | null;
};

export const COURIER_NAME = "Zipline Express";
export const BUSINESS_NAME = "Lakview Traders";

export type BatchStage = 0 | 1 | 2 | 3;

export const BATCH_STAGES: { key: BatchStage; label: string }[] = [
  { key: 0, label: "Gathering components" },
  { key: 1, label: "Assembling" },
  { key: 2, label: "Hygiene & quality check" },
  { key: 3, label: "Ready for dispatch" },
];

export const BATCH_STAGE_COLORS: Record<BatchStage, { text: string; bg: string; dot: string }> = {
  0: { text: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
  1: { text: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
  2: { text: "text-violet-700", bg: "bg-violet-100", dot: "bg-violet-500" },
  3: { text: "text-emerald-700", bg: "bg-emerald-100", dot: "bg-emerald-500" },
};

export const HYGIENE_CHECKLIST_LABELS = [
  "Workstation & hands sanitized",
  "Components checked (no damage, in date)",
  "Assembled to spec",
  "Final wipe-down & sealed for dispatch",
] as const;

export type ProductionBatch = {
  id: number;
  batchNumber: string;
  item: string;
  qty: number;
  stage: BatchStage;
  startedAt: string;
  stageStartedAt: string;
  checklist: boolean[];
  notes: string;
};

const SEED_CUSTOMERS: ShowcaseCustomer[] = [];

const SEED_ORDERS: ShowcaseOrder[] = [];

const SEED_COMPLAINTS: ShowcaseComplaint[] = [];

const SEED_BATCHES: ProductionBatch[] = [];

export type TeamChatMessage = { id: number; author: string; text: string; at: string };

const SEED_CHAT: TeamChatMessage[] = [];

type Listener = () => void;

class ShowcaseStore {
  private orders: ShowcaseOrder[] = SEED_ORDERS.map((o) => ({ ...o, history: [...o.history], checklist: [...o.checklist], teamNotes: [...o.teamNotes] }));
  private complaints: ShowcaseComplaint[] = SEED_COMPLAINTS.map((c) => ({ ...c }));
  private batches: ProductionBatch[] = SEED_BATCHES.map((b) => ({ ...b, checklist: [...b.checklist] }));
  private staffDirectory: StaffMember[] = STAFF_MEMBERS.map((s) => ({ ...s }));
  private chatMessages: TeamChatMessage[] = SEED_CHAT.map((m) => ({ ...m }));
  private listeners = new Set<Listener>();
  private nextId = SEED_ORDERS.length + 1;
  private nextComplaintId = SEED_COMPLAINTS.length + 1;
  private nextBatchId = SEED_BATCHES.length + 1;
  private nextStaffId = STAFF_MEMBERS.length + 1;

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
      orderNumber: "LT-" + (1000 + this.nextId),
      stage: 0,
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      history: [{ stage: 0, at: new Date().toISOString() }],
      rating: null,
      checklist: CHECKLIST_LABELS.map(() => false),
      teamNotes: [],
      ...input,
    };
    this.orders = [order, ...this.orders];
    this.emit();
    return order;
  };

  toggleChecklistItem = (orderId: number, index: number) => {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;
    order.checklist = order.checklist.map((v, i) => (i === index ? !v : v));
    this.orders = [...this.orders];
    this.emit();
  };

  addTeamNote = (orderId: number, author: string, text: string) => {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order || !text.trim()) return;
    const nextNoteId = (order.teamNotes[order.teamNotes.length - 1]?.id || 0) + 1;
    order.teamNotes = [...order.teamNotes, { id: nextNoteId, author, text: text.trim(), at: new Date().toISOString() }];
    this.orders = [...this.orders];
    this.emit();
  };

  getCustomers = (): ShowcaseCustomer[] => SEED_CUSTOMERS;

  getComplaints = (): ShowcaseComplaint[] => this.complaints;

  setComplaintStatus = (id: number, status: ComplaintStatus, resolution?: string) => {
    const complaint = this.complaints.find((c) => c.id === id);
    if (!complaint) return;
    complaint.status = status;
    if (resolution !== undefined) complaint.resolution = resolution;
    this.complaints = [...this.complaints];
    this.emit();
  };

  addComplaint = (input: Pick<ShowcaseComplaint, "customerName" | "phone" | "subject" | "details" | "orderNumber">) => {
    const complaint: ShowcaseComplaint = {
      id: this.nextComplaintId++,
      status: "Open",
      createdAt: new Date().toISOString(),
      resolution: null,
      ...input,
    };
    this.complaints = [complaint, ...this.complaints];
    this.emit();
    return complaint;
  };

  getBatches = (): ProductionBatch[] => this.batches;

  advanceBatch = (id: number) => {
    const batch = this.batches.find((b) => b.id === id);
    if (!batch || batch.stage >= 3) return;
    batch.stage = (batch.stage + 1) as BatchStage;
    batch.stageStartedAt = new Date().toISOString();
    this.batches = [...this.batches];
    this.emit();
  };

  toggleBatchChecklistItem = (id: number, index: number) => {
    const batch = this.batches.find((b) => b.id === id);
    if (!batch) return;
    batch.checklist = batch.checklist.map((v, i) => (i === index ? !v : v));
    this.batches = [...this.batches];
    this.emit();
  };

  addBatch = (input: Pick<ProductionBatch, "item" | "qty" | "notes">) => {
    const now = new Date().toISOString();
    const batch: ProductionBatch = {
      id: this.nextBatchId,
      batchNumber: "B-" + (200 + this.nextBatchId++),
      stage: 0,
      startedAt: now,
      stageStartedAt: now,
      checklist: HYGIENE_CHECKLIST_LABELS.map(() => false),
      ...input,
    };
    this.batches = [batch, ...this.batches];
    this.emit();
    return batch;
  };

  getStaffDirectory = (): StaffMember[] => this.staffDirectory;

  addStaffMember = (name: string, role: StaffMember["role"]) => {
    if (!name.trim()) return;
    const member: StaffMember = { id: this.nextStaffId++, name: name.trim(), role };
    this.staffDirectory = [...this.staffDirectory, member];
    this.emit();
    return member;
  };

  getChatMessages = (): TeamChatMessage[] => this.chatMessages;

  sendChatMessage = (author: string, text: string) => {
    if (!text.trim()) return;
    const nextChatId = (this.chatMessages[this.chatMessages.length - 1]?.id || 0) + 1;
    this.chatMessages = [...this.chatMessages, { id: nextChatId, author, text: text.trim(), at: new Date().toISOString() }];
    this.emit();
  };
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
