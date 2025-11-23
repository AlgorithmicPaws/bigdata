import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { 
  Invoice, 
  InvoiceDetail,
  InvoiceList, 
  InvoiceCreate,
  InvoiceFilters 
} from '../types';

/**
 * Obtiene lista de facturas (retorna solo el array)
 */
export async function getInvoices(params?: InvoiceFilters): Promise<Invoice[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.customer_id) queryParams.append('customer_id', params.customer_id.toString());
  if (params?.employee_id) queryParams.append('employee_id', params.employee_id.toString());
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.INVOICES}?${queryParams}`
    : ENDPOINTS.INVOICES;
  
  const result = await api.get<InvoiceList>(url);
  return result.invoices; // <-- Retorna solo el array
}

/**
 * Obtiene lista de facturas con paginación completa
 */
export async function getInvoicesPaginated(params?: InvoiceFilters): Promise<InvoiceList> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.customer_id) queryParams.append('customer_id', params.customer_id.toString());
  if (params?.employee_id) queryParams.append('employee_id', params.employee_id.toString());
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.INVOICES}?${queryParams}`
    : ENDPOINTS.INVOICES;
    
  return api.get<InvoiceList>(url);
}

/**
 * Obtiene una factura por ID con detalles completos
 */
export async function getInvoice(id: number): Promise<InvoiceDetail> {
  return api.get<InvoiceDetail>(ENDPOINTS.INVOICE_DETAIL(id));
}

/**
 * Crea una nueva factura (compra)
 */
export async function createInvoice(data: InvoiceCreate): Promise<InvoiceDetail> {
  return api.post<InvoiceDetail>(ENDPOINTS.INVOICES, data);
}

/**
 * Obtiene las facturas de un cliente específico (retorna solo el array)
 */
export async function getCustomerInvoices(
  customerId: number,
  params?: { page?: number; page_size?: number }
): Promise<Invoice[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.CUSTOMER_INVOICES(customerId)}?${queryParams}`
    : ENDPOINTS.CUSTOMER_INVOICES(customerId);
  
  const result = await api.get<InvoiceList>(url);
  return result.invoices; // <-- Retorna solo el array
}