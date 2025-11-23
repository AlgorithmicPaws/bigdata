import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import type { ApiError } from './types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

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

function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    // Convertir el tipo unknown a string seguro
    const detail = typeof error.response.data === 'string' 
      ? error.response.data 
      : JSON.stringify(error.response.data);
    
    return {
      message: error.message,
      status: error.response.status,
      detail: detail,
    };
  } else if (error.request) {
    return {
      message: 'No se recibió respuesta del servidor',
      status: 0,
      detail: 'Sin respuesta del servidor',
    };
  } else {
    return {
      message: error.message || 'Error desconocido',
      status: 0,
      detail: 'Error desconocido',
    };
  }
}

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