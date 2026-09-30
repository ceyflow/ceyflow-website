"use client";
import { useSyncExternalStore } from "react";
import { showcaseStore } from "./showcaseData";

export function useShowcaseOrders() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getOrders, showcaseStore.getOrders);
}

export function useShowcaseComplaints() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getComplaints, showcaseStore.getComplaints);
}

export function useShowcaseBatches() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getBatches, showcaseStore.getBatches);
}

export function useShowcaseChat() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getChatMessages, showcaseStore.getChatMessages);
}

export function useShowcaseStaffDirectory() {
  return useSyncExternalStore(showcaseStore.subscribe, showcaseStore.getStaffDirectory, showcaseStore.getStaffDirectory);
}
