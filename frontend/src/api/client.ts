import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import type { ApiError } from './types';

// Crear instancia de Axios con configuración base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requests (para logging y futuro auth)
axiosInstance.interceptors.request.use(
  (config) => {
    // Log para desarrollo
    if (import.meta.env.DEV) {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Aquí se puede agregar el token de autenticación en el futuro
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de responses (para manejo de errores)
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', handleApiError(error));
    return Promise.reject(handleApiError(error));
  }
);

// Función para transformar errores de Axios a formato estándar
function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    return {
      message: error.message,
      status: error.response.status,
      detail: error.response.data,
    };
  } else if (error.request) {
    return {
      message: 'No se recibió respuesta del servidor',
      status: 0,
      detail: error.request,
    };
  } else {
    return {
      message: error.message || 'Error desconocido',
      status: 0,
      detail: null,
    };
  }
}

// API client con métodos tipados
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

export default api;