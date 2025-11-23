// Configuración de la API desde variables de entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Configuración central de la API
export const API_CONFIG = {
  BASE_URL,
  API_VERSION,
  TIMEOUT: 30000, // 30 segundos
} as const;

// Endpoints de la API
export const ENDPOINTS = {
  // Artists
  ARTISTS: `/api/${API_VERSION}/artists`,
  ARTIST_DETAIL: (id: number) => `/api/${API_VERSION}/artists/${id}`,

  // Albums
  ALBUMS: `/api/${API_VERSION}/albums`,
  ALBUM_DETAIL: (id: number) => `/api/${API_VERSION}/albums/${id}`,

  // Tracks
  TRACKS: `/api/${API_VERSION}/tracks`,
  TRACK_DETAIL: (id: number) => `/api/${API_VERSION}/tracks/${id}`,

  // Genres
  GENRES: `/api/${API_VERSION}/genres`,
  GENRE_DETAIL: (id: number) => `/api/${API_VERSION}/genres/${id}`,

  // Customers
  CUSTOMERS: `/api/${API_VERSION}/customers`,
  CUSTOMER_DETAIL: (id: number) => `/api/${API_VERSION}/customers/${id}`,
  CUSTOMER_HISTORY: (id: number) => `/api/${API_VERSION}/customers/${id}/purchase-history`,

  // Invoices
  INVOICES: `/api/${API_VERSION}/invoices`,
  INVOICE_DETAIL: (id: number) => `/api/${API_VERSION}/invoices/${id}`,
  CUSTOMER_INVOICES: (customerId: number) => `/api/${API_VERSION}/customers/${customerId}/invoices`,

  // Stats
  STATS_TOP_TRACKS: `/api/${API_VERSION}/stats/top-tracks`,
  STATS_TOP_GENRES: `/api/${API_VERSION}/stats/top-genres`,
  STATS_TOP_CUSTOMERS: `/api/${API_VERSION}/stats/top-customers`,
  STATS_SALES_BY_EMPLOYEE: `/api/${API_VERSION}/stats/sales-by-employee`,
  STATS_MONTHLY_SALES: `/api/${API_VERSION}/stats/monthly-sales`,
} as const;

/**
 * Helper para construir URLs completas
 */
export function getApiUrl(endpoint: string): string {
  return `${BASE_URL}${endpoint}`;
}