import { api } from '../client';
import { ENDPOINTS } from '../../config/api.config';
import type { Genre, GenreList } from '../types';

/**
 * Obtiene lista de todos los géneros
 */
export async function getGenres(): Promise<GenreList> {
  return api.get<GenreList>(ENDPOINTS.GENRES);
}

/**
 * Obtiene un género por ID
 */
export async function getGenre(id: number): Promise<Genre> {
  return api.get<Genre>(ENDPOINTS.GENRE_DETAIL(id));
}