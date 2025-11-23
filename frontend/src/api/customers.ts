// src/api/customers.ts
import apiFetch from "./client";
import type { Customer, CustomerCreate, CustomerPurchaseHistoryItem } from "./types";

export function getCustomers() {
  return apiFetch<Customer[]>("/customers/");
}

export function createCustomer(data: CustomerCreate) {
  return apiFetch<Customer>("/customers/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCustomerHistory(customerId: number) {
  return apiFetch<CustomerPurchaseHistoryItem[]>(
    `/purchases/customer/${customerId}/history`
  );
}
