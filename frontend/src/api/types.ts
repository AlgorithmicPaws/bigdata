// src/api/types.ts

// --- Customers ---
export interface Customer {
  CustomerId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string | null;
  SupportRepId?: number | null;
}

export interface CustomerCreate {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string;
  SupportRepId?: number;
}

// --- Tracks ---
export interface Track {
  TrackId: number;
  Name: string;
  Composer?: string | null;
  UnitPrice: number;
}

export interface TrackCreate {
  Name: string;
  Composer?: string;
  UnitPrice: number;
}

// --- Purchases ---
export interface PurchasePayload {
  customer_id: number;
  employee_id?: number;
  billing_address?: string;
  track_ids: number[];
}

export interface PurchaseResponse {
  purchase_id: number;
  customer_id: number;
  employee_id?: number | null;
  billing_address?: string | null;
  total: number;
}

export interface CustomerPurchaseHistoryItem {
  purchase_id: number;
  customer_id: number;
  employee_id?: number | null;
  billing_address?: string | null;
}
