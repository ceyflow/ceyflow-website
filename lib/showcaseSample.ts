// Optional sample data for the /showcase product demo ("Lakview Traders").
// Everything here is fictional: the names, phone numbers, addresses and
// tracking numbers do not belong to real people or a real courier. The demo
// still opens blank; this is only loaded when someone clicks "Load sample data".
import type {
  ProductionBatch,
  ShowcaseComplaint,
  ShowcaseCustomer,
  ShowcaseOrder,
  StaffMember,
  TeamChatMessage,
  OrderStage,
} from "./showcaseData";

export type ShowcaseSample = {
  orders: ShowcaseOrder[];
  customers: ShowcaseCustomer[];
  complaints: ShowcaseComplaint[];
  batches: ProductionBatch[];
  chat: TeamChatMessage[];
  staff: StaffMember[];
};

const HOUR = 3600_000;

export function buildShowcaseSample(now: number): ShowcaseSample {
  const ago = (hours: number) => new Date(now - hours * HOUR).toISOString();

  // History: one entry per stage reached, spread evenly from creation to now
  // (the final stage is stamped a few hours ago so "delivered this week" is true).
  function historyFor(stage: OrderStage, createdHoursAgo: number) {
    const entries: { stage: OrderStage; at: string }[] = [];
    for (let s = 0; s <= stage; s++) {
      const fraction = stage === 0 ? 0 : s / stage;
      entries.push({ stage: s as OrderStage, at: ago(createdHoursAgo * (1 - fraction * 0.85)) });
    }
    return entries;
  }

  const order = (
    id: number,
    o: Omit<ShowcaseOrder, "id" | "orderNumber" | "createdAt" | "history" | "checklist" | "teamNotes" | "rating" | "trackingNumber"> & {
      hoursAgo: number;
      tracking?: string;
      rating?: number;
      checked?: number;
      notesList?: { author: string; text: string; hoursAgo: number }[];
    }
  ): ShowcaseOrder => ({
    id,
    orderNumber: `LT-${1000 + id}`,
    customerName: o.customerName,
    phone: o.phone,
    address: o.address,
    product: o.product,
    qty: o.qty,
    priority: o.priority,
    stage: o.stage,
    trackingNumber: o.tracking ?? null,
    createdAt: ago(o.hoursAgo),
    history: historyFor(o.stage, o.hoursAgo),
    notes: o.notes,
    rating: o.rating ?? null,
    checklist: [0, 1, 2, 3].map((i) => i < (o.checked ?? 0)),
    teamNotes: (o.notesList ?? []).map((n, i) => ({ id: i + 1, author: n.author, text: n.text, at: ago(n.hoursAgo) })),
  });

  const orders: ShowcaseOrder[] = [
    order(8, { customerName: "Ishara Wijesekara", phone: "070 000 0108", address: "66 Station Rd, Matara", product: "Festive gift hamper (large)", qty: 1, priority: "High", stage: 2, notes: "", hoursAgo: 14, checked: 3 }),
    order(7, { customerName: "Dilani Perera", phone: "070 000 0101", address: "12 Lake Rd, Nugegoda", product: "Spice combo pack", qty: 2, priority: "Medium", stage: 3, notes: "", hoursAgo: 120, tracking: "ZE88201388", rating: 5, checked: 4 }),
    order(6, { customerName: "Mohamed Rizwan", phone: "070 000 0106", address: "3 Park Ave, Colombo 06", product: "Spice combo pack", qty: 1, priority: "Low", stage: 0, notes: "", hoursAgo: 1 }),
    order(5, { customerName: "Anjali Jayasinghe", phone: "070 000 0105", address: "101 Main St, Negombo", product: "Herbal tea gift set", qty: 2, priority: "Medium", stage: 0, notes: "Gift wrap please.", hoursAgo: 3 }),
    order(4, {
      customerName: "Hasitha Silva", phone: "070 000 0104", address: "27 Hill St, Kurunegala", product: "Festive gift hamper (small)", qty: 5, priority: "High", stage: 1,
      notes: "Corporate order. Add greeting cards.", hoursAgo: 9, checked: 1,
      notesList: [{ author: "Nimali (Packer)", text: "Greeting cards are in the top drawer.", hoursAgo: 4 }],
    }),
    order(3, { customerName: "Shalini Kumar", phone: "070 000 0103", address: "8 Beach Rd, Galle", product: "Spice combo pack", qty: 3, priority: "Low", stage: 2, notes: "", hoursAgo: 20, checked: 4 }),
    order(2, { customerName: "Ruwan Fernando", phone: "070 000 0102", address: "45 Temple Rd, Kandy", product: "Herbal tea gift set", qty: 1, priority: "Medium", stage: 3, notes: "", hoursAgo: 40, tracking: "ZE88201502", rating: 4, checked: 4 }),
    order(1, { customerName: "Dilani Perera", phone: "070 000 0101", address: "12 Lake Rd, Nugegoda", product: "Festive gift hamper (large)", qty: 2, priority: "High", stage: 3, notes: "", hoursAgo: 52, tracking: "ZE88201455", rating: 5, checked: 4 }),
  ];

  // One customer per distinct name, with a real order count.
  const byName = new Map<string, ShowcaseCustomer>();
  for (const o of [...orders].reverse()) {
    const existing = byName.get(o.customerName);
    if (existing) existing.totalOrders += 1;
    else byName.set(o.customerName, { id: byName.size + 1, name: o.customerName, phone: o.phone, city: o.address.split(",").pop()!.trim(), totalOrders: 1 });
  }

  const complaints: ShowcaseComplaint[] = [
    { id: 3, orderNumber: "LT-1002", customerName: "Ruwan Fernando", phone: "070 000 0102", subject: "Tea box dented on arrival", details: "The outer box was crushed at one corner. The tea inside looks fine.", status: "Open", createdAt: ago(6), resolution: null },
    { id: 2, orderNumber: "LT-1007", customerName: "Dilani Perera", phone: "070 000 0101", subject: "Missing item in combo pack", details: "The pack should have had 6 spice jars but only 5 were inside.", status: "In progress", createdAt: ago(30), resolution: null },
    { id: 1, orderNumber: null, customerName: "Kamal Rathnayake", phone: "070 000 0109", subject: "Delivery came late", details: "Order arrived two days after the promised date.", status: "Resolved", createdAt: ago(96), resolution: "Apologised and gave 10% off the next order." },
  ];

  const batches: ProductionBatch[] = [
    { id: 3, batchNumber: "B-203", item: "Herbal tea gift set", qty: 60, stage: 0, startedAt: ago(2), stageStartedAt: ago(2), checklist: [false, false, false, false], notes: "Waiting on the second box delivery." },
    { id: 2, batchNumber: "B-202", item: "Spice combo pack", qty: 100, stage: 1, startedAt: ago(10), stageStartedAt: ago(5), checklist: [true, true, false, false], notes: "" },
    { id: 1, batchNumber: "B-201", item: "Festive gift hamper (large)", qty: 40, stage: 2, startedAt: ago(30), stageStartedAt: ago(3), checklist: [true, true, true, false], notes: "Priority batch for the corporate order." },
  ];

  const chat: TeamChatMessage[] = [
    { id: 1, author: "Nimali (Packer)", text: "B-201 hampers are assembled. Starting the quality check now.", at: ago(5) },
    { id: 2, author: "Kasun (Dispatcher)", text: "Courier pickup is at 3pm today, so anything marked ready by 2pm goes out.", at: ago(4) },
    { id: 3, author: "You (Owner)", text: "Thanks both. LT-1004 is a corporate order, please double-check the greeting cards.", at: ago(3) },
    { id: 4, author: "Nimali (Packer)", text: "Will do. Cards are in the top drawer.", at: ago(2.5) },
  ];

  const staff: StaffMember[] = [
    { id: 1, name: "You (Owner)", role: "Admin" },
    { id: 2, name: "Nimali (Packer)", role: "Packer" },
    { id: 3, name: "Kasun (Dispatcher)", role: "Dispatcher" },
  ];

  return { orders, customers: [...byName.values()], complaints, batches, chat, staff };
}
