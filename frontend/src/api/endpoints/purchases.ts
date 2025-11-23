import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { InvoiceDetail, InvoiceItemCreate } from '../types';

export interface PurchasePayload {
  customer_id: number;
  employee_id?: number;
  billing_address?: string;
  track_ids: number[];
}

export interface PurchaseResult {
  purchase_id: number;
  total: number;
}

/**
 * Registra una nueva compra (crea una factura)
 */
export async function registerPurchase(payload: PurchasePayload): Promise<PurchaseResult> {
  // Convertir el payload al formato que espera la API
  const items: InvoiceItemCreate[] = payload.track_ids.map(trackId => ({
    TrackId: trackId,
    Quantity: 1,
  }));

  const invoiceData = {
    CustomerId: payload.customer_id,
    EmployeeId: payload.employee_id || null,
    BillingAddress: payload.billing_address || null,
    items,
  };

  const result = await api.post<InvoiceDetail>(ENDPOINTS.INVOICES, invoiceData);

  return {
    purchase_id: result.InvoiceId,
    total: parseFloat(result.Total),
  };
}