"use server";
import { db } from "../../../lib/db";

export type ContactState = { ok: boolean; error?: string };

export async function submitInquiry(_: ContactState, fd: FormData): Promise<ContactState> {
  if (String(fd.get("website") || "")) return { ok: true }; // honeypot
  const get = (k: string) => String(fd.get(k) || "").trim().slice(0, 2000);
  const name = get("name");
  const email = get("email");
  const phone = get("phone");
  if (!name) return { ok: false, error: "Please tell us your name." };
  if (!email && !phone) return { ok: false, error: "Please give us an email or phone number so we can reply." };
  db.prepare("INSERT INTO inquiries (name, company, email, phone, interest, message) VALUES (?, ?, ?, ?, ?, ?)").run(
    name, get("company"), email, phone, get("interest"), get("message")
  );
  return { ok: true };
}
