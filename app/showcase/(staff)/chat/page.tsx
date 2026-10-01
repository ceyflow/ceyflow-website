"use client";
import { useState } from "react";
import { showcaseStore } from "@/lib/showcaseData";
import { useShowcaseChat } from "@/lib/useShowcaseOrders";
import { useShowcaseStaff } from "@/lib/showcaseStaffContext";

export default function ShowcaseChat() {
  const messages = useShowcaseChat();
  const { staff } = useShowcaseStaff();
  const [draft, setDraft] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    showcaseStore.sendChatMessage(staff.name, draft);
    setDraft("");
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-4rem)]">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Team chat</h1>
        <p className="mt-1 text-sm text-slate-500">One shared channel for the whole team — no separate app needed.</p>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No messages yet — say hello to the team.</p>
        )}
        {messages.map((m) => {
          const mine = m.author === staff.name;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${mine ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                {!mine && <p className="mb-0.5 text-[11px] font-semibold text-indigo-600">{m.author}</p>}
                <p>{m.text}</p>
                <p className={`mt-0.5 text-right text-[10px] ${mine ? "text-indigo-100" : "text-slate-400"}`}>
                  {new Date(m.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message as ${staff.name}…`}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        />
        <button type="submit" disabled={!draft.trim()} className="flex-none rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">Send</button>
      </form>
    </div>
  );
}
