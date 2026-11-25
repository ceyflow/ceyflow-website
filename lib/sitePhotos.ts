// Real photos for the public site. Every slot is optional: a slot with no entry here
// renders nothing and the page lays out without it. To add a photo, put the file in
// public/photos/ and add an entry below (see docs/PHOTOS.md for what to shoot).

export type PhotoSlot =
  | "home" // wide band on the home page
  | "about" // wide band under the About heading
  | "order-management"
  | "delivery-tracking"
  | "sms-automation"
  | "inventory-production";

export type SitePhoto = {
  src: string; // e.g. "/photos/packing-table.jpg"
  alt: string; // describe what is in the picture, for people using a screen reader
  width: number; // the file's real pixel size, so the page doesn't jump while it loads
  height: number;
  caption?: string;
};

export const PHOTOS: Partial<Record<PhotoSlot, SitePhoto>> = {
  // home: { src: "/photos/packing-room.jpg", alt: "…", width: 1600, height: 700, caption: "…" },
};
