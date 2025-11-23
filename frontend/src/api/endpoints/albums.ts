import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { AlbumDetail, AlbumList, AlbumFilters } from '../types';

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
  return result.albums;
}

export async function getAlbum(id: number): Promise<AlbumDetail> {
  return api.get<AlbumDetail>(ENDPOINTS.ALBUM_DETAIL(id));
}