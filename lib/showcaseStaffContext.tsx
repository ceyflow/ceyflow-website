"use client";
import { createContext, useContext, useState } from "react";
import { STAFF_MEMBERS, type StaffMember } from "./showcaseData";

const ShowcaseStaffContext = createContext<{ staff: StaffMember; setStaff: (s: StaffMember) => void } | null>(null);

export function ShowcaseStaffProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<StaffMember>(STAFF_MEMBERS[0]);
  return <ShowcaseStaffContext.Provider value={{ staff, setStaff }}>{children}</ShowcaseStaffContext.Provider>;
}

export function useShowcaseStaff() {
  const ctx = useContext(ShowcaseStaffContext);
  if (!ctx) throw new Error("useShowcaseStaff must be used within ShowcaseStaffProvider");
  return ctx;
}
