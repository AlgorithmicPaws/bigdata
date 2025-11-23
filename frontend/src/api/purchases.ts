// src/api/purchases.ts
import apiFetch from "./client";
import type { PurchasePayload, PurchaseResponse } from "./types";

export function registerPurchase(payload: PurchasePayload) {
  return apiFetch<PurchaseResponse>("/purchases/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
