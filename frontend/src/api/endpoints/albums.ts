import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { Album, AlbumDetail, AlbumList, AlbumFilters } from '../types';

/**
 * Obtiene lista de álbumes (retorna solo el array)
 */
export async function getAlbums(params?: AlbumFilters): Promise<AlbumDetail[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.artist_id) queryParams.append('artist_id', params.artist_id.toString());
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.ALBUMS}?${queryParams}`
    : ENDPOINTS.ALBUMS;
  
  const result = await api.get<AlbumList>(url);
  return result.albums; // <-- Retorna solo el array
}

/**
 * Obtiene lista de álbumes con paginación completa
 */
export async function getAlbumsPaginated(params?: AlbumFilters): Promise<AlbumList> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.artist_id) queryParams.append('artist_id', params.artist_id.toString());
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.ALBUMS}?${queryParams}`
    : ENDPOINTS.ALBUMS;
    
  return api.get<AlbumList>(url);
}

/**
 * Obtiene un álbum por ID con detalles completos
 */
export async function getAlbum(id: number): Promise<AlbumDetail> {
  return api.get<AlbumDetail>(ENDPOINTS.ALBUM_DETAIL(id));
}