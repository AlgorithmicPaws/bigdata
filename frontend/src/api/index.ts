// Exportar cliente y tipos
export { api, default as apiClient } from './client';
export * from './types';

// Re-exportar configuración
export { API_CONFIG, ENDPOINTS, getApiUrl } from '../config/api.config';

// Exportar todos los servicios de endpoints
export * from './endpoints';