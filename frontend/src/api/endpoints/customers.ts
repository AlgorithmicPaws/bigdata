import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { 
  Customer, 
  CustomerList, 
  CustomerCreate, 
  CustomerUpdate,
  SearchParams,
  InvoiceList,
  CustomerPurchaseHistoryItem
} from '../types';

/**
 * Obtiene lista de clientes con paginación (retorna array simple)
 */
export async function getCustomers(params?: SearchParams): Promise<Customer[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.CUSTOMERS}?${queryParams}`
    : ENDPOINTS.CUSTOMERS;
  
  const result = await api.get<CustomerList>(url);
  return result.customers; // Retorna solo el array
}

/**
 * Obtiene lista de clientes con info de paginación completa
 */
export async function getCustomersPaginated(params?: SearchParams): Promise<CustomerList> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.CUSTOMERS}?${queryParams}`
    : ENDPOINTS.CUSTOMERS;
  
  return api.get<CustomerList>(url);
}

/**
 * Obtiene un cliente por ID
 */
export async function getCustomer(id: number): Promise<Customer> {
  return api.get<Customer>(ENDPOINTS.CUSTOMER_DETAIL(id));
}

/**
 * Crea un nuevo cliente
 */
export async function createCustomer(data: CustomerCreate): Promise<Customer> {
  return api.post<Customer>(ENDPOINTS.CUSTOMERS, data);
}

/**
 * Actualiza un cliente existente
 */
export async function updateCustomer(id: number, data: CustomerUpdate): Promise<Customer> {
  return api.put<Customer>(ENDPOINTS.CUSTOMER_DETAIL(id), data);
}

/**
 * Elimina un cliente
 */
export async function deleteCustomer(id: number): Promise<void> {
  return api.delete<void>(ENDPOINTS.CUSTOMER_DETAIL(id));
}

/**
 * Obtiene el historial de compras de un cliente
 */
export async function getCustomerHistory(
  customerId: number,
  params?: { page?: number; page_size?: number }
): Promise<CustomerPurchaseHistoryItem[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.CUSTOMER_INVOICES(customerId)}?${queryParams}`
    : ENDPOINTS.CUSTOMER_INVOICES(customerId);
  
  const result = await api.get<InvoiceList>(url);
  
  // Mapear de Invoice[] a CustomerPurchaseHistoryItem[]
  return result.invoices.map(invoice => ({
    purchase_id: invoice.InvoiceId,
    employee_id: invoice.EmployeeId,
    billing_address: invoice.BillingAddress,
  }));
}