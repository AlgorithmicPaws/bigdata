import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTracks } from '../api/endpoints/tracks';
import { getGenres } from '../api/endpoints/genres';
import type { TrackDetail, Genre } from '../api/types';
import AddToCartButton from '../components/cart/AddToCartButton';
import './BrowsePage.css';

export default function BrowsePage() {
  const [tracks, setTracks] = useState<TrackDetail[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadTracks();
  }, [search, selectedGenre, page]);

  const loadGenres = async () => {
    try {
      const data = await getGenres();
      setGenres(data.genres);
    } catch (err: any) {
      console.error('Error loading genres:', err);
    }
  };

  const loadTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTracks({
        page,
        page_size: pageSize,
        search: search || undefined,
        genre_id: selectedGenre || undefined,
      });
      setTracks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar canciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="browse-page">
      <div className="browse-header">
        <div>
          <h1>Catálogo de Música</h1>
          <p>Explora nuestra colección completa de canciones</p>
        </div>
        <div className="browse-stats">
          {!loading && <span className="chip">{tracks.length} canciones</span>}
        </div>
      </div>

      {/* Filtros */}
      <div className="browse-filters">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Buscar por nombre, artista, álbum..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-genres">
          <button
            className={`genre-chip ${selectedGenre === null ? 'active' : ''}`}
            onClick={() => handleGenreChange(null)}
          >
            Todos
          </button>
          {genres.map((genre) => (
            <button
              key={genre.GenreId}
              className={`genre-chip ${selectedGenre === genre.GenreId ? 'active' : ''}`}
              onClick={() => handleGenreChange(genre.GenreId)}
            >
              {genre.Name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de tracks */}
      {loading ? (
        <div className="loading-state">
          <p>Cargando canciones...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={loadTracks} className="btn">
            Reintentar
          </button>
        </div>
      ) : tracks.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron canciones con los filtros seleccionados</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedGenre(null);
              setPage(1);
            }}
            className="btn"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="tracks-grid">
            {tracks.map((track) => (
              <div key={track.TrackId} className="track-card">
                <div className="track-image">
                  <div className="track-placeholder">🎵</div>
                </div>
                
                <div className="track-info">
                  <Link to={`/tracks/${track.TrackId}`} className="track-name">
                    {track.Name}
                  </Link>
                  <p className="track-artist">
                    {track.artist_name || 'Artista desconocido'}
                  </p>
                  <p className="track-album">
                    {track.album?.Title || 'Sin álbum'}
                  </p>
                  <div className="track-meta">
                    <span className="track-genre">{track.genre_name || 'Sin género'}</span>
                    <span className="track-duration">{formatDuration(track.Milliseconds)}</span>
                  </div>
                </div>

                <div className="track-actions">
                  <p className="track-price">${parseFloat(track.UnitPrice).toFixed(2)}</p>
                  <AddToCartButton track={track} />
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn"
            >
              ← Anterior
            </button>
            <span className="page-info">Página {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={tracks.length < pageSize}
              className="btn"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}