import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { TrackList, TrackDetail, TrackFilters } from '../types';

/**
 * Obtiene lista de tracks (retorna solo el array)
 */
export async function getTracks(params?: TrackFilters): Promise<TrackDetail[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.album_id) queryParams.append('album_id', params.album_id.toString());
  if (params?.genre_id) queryParams.append('genre_id', params.genre_id.toString());
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.TRACKS}?${queryParams}`
    : ENDPOINTS.TRACKS;
  
  const result = await api.get<TrackList>(url);
  return result.tracks; // <-- Retorna solo el array
}

/**
 * Obtiene lista de tracks con paginación completa
 */
export async function getTracksPaginated(params?: TrackFilters): Promise<TrackList> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.album_id) queryParams.append('album_id', params.album_id.toString());
  if (params?.genre_id) queryParams.append('genre_id', params.genre_id.toString());
  
  const url = queryParams.toString() 
    ? `${ENDPOINTS.TRACKS}?${queryParams}`
    : ENDPOINTS.TRACKS;
    
  return api.get<TrackList>(url);
}

/**
 * Obtiene un track por ID con información completa
 */
export async function getTrack(id: number): Promise<TrackDetail> {
  return api.get<TrackDetail>(ENDPOINTS.TRACK_DETAIL(id));
}