"use client";
import { useSyncExternalStore } from "react";
import { showcaseStore } from "./showcaseData";

export function useShowcaseOrders() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getOrders, showcaseStore.getOrders);
}

export function useShowcaseComplaints() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getComplaints, showcaseStore.getComplaints);
}
