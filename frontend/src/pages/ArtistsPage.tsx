import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArtists } from '../api/endpoints/artists';
import type { Artist } from '../api/types';
import './ArtistsPage.css';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    loadArtists();
  }, [search, page]);

  const loadArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArtists({
        page,
        page_size: pageSize,
        search: search || undefined,
      });
      setArtists(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar artistas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="artists-page">
      <div className="page-header">
        <div>
          <h1>🎸 Artistas</h1>
          <p>Explora nuestra colección de artistas musicales</p>
        </div>
        {!loading && <span className="chip">{artists.length} artistas</span>}
      </div>

      {/* Búsqueda */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar artistas..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Grid de artistas */}
      {loading ? (
        <div className="loading-state">
          <p>Cargando artistas...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={loadArtists} className="btn">Reintentar</button>
        </div>
      ) : artists.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron artistas</p>
        </div>
      ) : (
        <>
          <div className="artists-grid">
            {artists.map((artist) => (
              <Link
                key={artist.ArtistId}
                to={`/artists/${artist.ArtistId}`}
                className="artist-card"
              >
                <div className="artist-avatar">
                  <span className="artist-initial">
                    {artist.Name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <h3 className="artist-name">{artist.Name || 'Artista desconocido'}</h3>
              </Link>
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
            <span>Página {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={artists.length < pageSize}
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