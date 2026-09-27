// Starting content, taken from the Ceyflow Service Catalog. Everything here is editable in the admin area.

export const SEED_SETTINGS: Record<string, string> = {
  company_name: "Ceyflow",
  company_tagline: "Business operations systems for growing Sri Lankan brands",
  company_email: "hello.ceyflow@gmail.com",
  company_phone: "+94 70 134 0255",
  company_whatsapp: "94701340255",
  company_address: "Colombo, Sri Lanka",
  bank_details: "Bank: [Your bank]\nAccount name: Ceyflow\nAccount no: [0000 0000 0000]\nBranch: [Branch]",
  currency: "LKR",
  invoice_prefix: "INV-",
  quote_prefix: "QT-",
  default_tax_rate: "0",
  quote_terms: "This quotation is valid for 30 days. 50% of the setup fee is due to start work, the balance on go-live. Monthly fees are billed in advance.",
  invoice_terms: "Payment is due within 14 days. Please use the invoice number as the payment reference.",
};

export const SEED_PACKAGES = [
  {
    slug: "order-management",
    name: "Order Management",
    tagline: "Every order on one shared board, from received to delivered.",
    solves: "Orders lost in chats and notebooks",
    bestFor: "Any business taking orders by phone, Facebook or WhatsApp",
    description:
      "One shared board where every order moves from received to delivered, so nothing is lost and anyone on the team can see its status. Built for online sellers and small brands taking 20 to 500 orders a month, usually with 2 to 15 staff.",
    features: [
      "Orders board with your own stages",
      "New order form, full order history, invoice numbering, printable invoices and labels",
      "Customer records with order history and an inquiry page for staff taking calls",
      "Complaints log with categories, priorities, assignment and status",
      "Customer ratings with a review link sent after delivery",
      "Dashboard of recent orders and progress, CSV export",
      "Staff logins with role-based page access, team chat and your branding",
    ],
    timeline: "2 to 4 weeks, including one round of changes after your team starts using it.",
    note: "",
  },
  {
    slug: "delivery-tracking",
    name: "Delivery Tracking",
    tagline: "Customers track their parcel on your website, not by calling you.",
    solves: "Customers calling to ask where their parcel is",
    bestFor: "Businesses shipping COD parcels by courier",
    description:
      "Customers see live courier status on your own website, which cuts \"where is my order?\" calls. Built for businesses sending cash-on-delivery parcels through Sri Lankan couriers.",
    features: [
      "Public \"Track your order\" page on your domain",
      "Live courier timeline pulled from the courier's API",
      "Staff enter the tracking number once, in the order",
      "Fallback link to the courier's own site",
      "Courier API keys stored securely on the server",
    ],
    timeline: "1 to 2 weeks per courier. Works with Order Management or your existing order list.",
    note: "Optional: create courier pickups, print waybills and receive push status updates.",
  },
  {
    slug: "sms-automation",
    name: "SMS Automation",
    tagline: "The right text at the right moment, without typing a thing.",
    solves: "Manual texting and no repeat-customer marketing",
    bestFor: "Businesses with a customer phone list",
    description:
      "Customers get a text at the moments that matter, and you can send promotions to your whole list without anyone typing messages by hand.",
    features: [
      "Automatic SMS when an order reaches a chosen stage",
      "Manual \"Send SMS\" button on each order, with confirmation",
      "Editable message templates with order details filled in",
      "Bulk SMS campaigns with recipient lists and campaign history",
      "Works with local SMS gateways such as send.lk",
    ],
    timeline: "About 1 week. Works best with Order Management.",
    note: "SMS credits are billed by the gateway and paid directly by you.",
  },
  {
    slug: "inventory-production",
    name: "Inventory and Production",
    tagline: "Run the factory floor from a screen instead of paper sheets.",
    solves: "Batches, recipes and QC tracked on paper",
    bestFor: "Small manufacturers: cosmetics, food, herbal and cleaning products",
    description:
      "Every production batch is planned from a recipe, tracked step by step through quality checks, and signed off. Ideal for manufacturers working toward GMP compliance.",
    features: [
      "Recipe library with raw material amounts scaled to batch size",
      "Batch numbers, printable batch sheets and staff signatures",
      "Production board with your own stages and QC checkpoints",
      "Step timers with alerts for timed processes",
      "GMP checklists and task templates",
      "Supplier records",
    ],
    timeline: "3 to 5 weeks, mostly spent mapping your recipes and QC steps.",
    note: "",
  },
];

export const SEED_BUNDLES = [
  { name: "Starter", includes: "Order Management + SMS Automation", description: "Get every order organised and keep customers informed automatically.", highlight: false },
  { name: "Growth", includes: "Starter + Delivery Tracking", description: "Cut status calls with live courier tracking on your own website.", highlight: true },
  { name: "Full Operations", includes: "All four systems", description: "Orders, delivery, SMS and production in one place — a complete operations platform.", highlight: false },
];
