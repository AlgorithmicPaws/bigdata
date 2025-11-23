import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { 
  TopTracksResponse,
  TopGenresResponse,
  TopCustomersResponse,
  SalesByEmployeeResponse,
  MonthlySalesResponse
} from '../types';

/**
 * Obtiene los tracks más vendidos
 */
export async function getTopTracks(limit: number = 10): Promise<TopTracksResponse> {
  return api.get<TopTracksResponse>(`${ENDPOINTS.STATS_TOP_TRACKS}?limit=${limit}`);
}

/**
 * Obtiene los géneros más vendidos
 */
export async function getTopGenres(limit: number = 10): Promise<TopGenresResponse> {
  return api.get<TopGenresResponse>(`${ENDPOINTS.STATS_TOP_GENRES}?limit=${limit}`);
}

/**
 * Obtiene los mejores clientes
 */
export async function getTopCustomers(limit: number = 10): Promise<TopCustomersResponse> {
  return api.get<TopCustomersResponse>(`${ENDPOINTS.STATS_TOP_CUSTOMERS}?limit=${limit}`);
}

/**
 * Obtiene ventas por empleado
 */
export async function getSalesByEmployee(): Promise<SalesByEmployeeResponse> {
  return api.get<SalesByEmployeeResponse>(ENDPOINTS.STATS_SALES_BY_EMPLOYEE);
}

/**
 * Obtiene ventas mensuales
 */
export async function getMonthlySales(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<MonthlySalesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.STATS_MONTHLY_SALES}?${queryParams}`
    : ENDPOINTS.STATS_MONTHLY_SALES;
    
  return api.get<MonthlySalesResponse>(url);
}