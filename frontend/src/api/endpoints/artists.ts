import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { Artist, ArtistList, SearchParams } from '../types';

/**
 * Obtiene lista de artistas (retorna solo el array)
 */
export async function getArtists(params?: SearchParams): Promise<Artist[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.ARTISTS}?${queryParams}`
    : ENDPOINTS.ARTISTS;
  
  const result = await api.get<ArtistList>(url);
  return result.artists; // <-- Retorna solo el array
}

/**
 * Obtiene lista de artistas con paginación completa
 */
export async function getArtistsPaginated(params?: SearchParams): Promise<ArtistList> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.ARTISTS}?${queryParams}`
    : ENDPOINTS.ARTISTS;
    
  return api.get<ArtistList>(url);
}

/**
 * Obtiene un artista por ID
 */
export async function getArtist(id: number): Promise<Artist> {
  return api.get<Artist>(ENDPOINTS.ARTIST_DETAIL(id));
}