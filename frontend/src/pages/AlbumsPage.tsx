import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAlbums } from '../api/endpoints/albums';
import { getArtists } from '../api/endpoints/artists';
import type { AlbumDetail, Artist } from '../api/types';
import './AlbumsPage.css';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<AlbumDetail[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    loadArtists();
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [search, selectedArtist, page]);

  const loadArtists = async () => {
    try {
      const data = await getArtists({ page_size: 200 });
      setArtists(data);
    } catch (err: any) {
      console.error('Error loading artists:', err);
    }
  };

  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAlbums({
        page,
        page_size: pageSize,
        search: search || undefined,
        artist_id: selectedArtist || undefined,
      });
      setAlbums(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar álbumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleArtistChange = (artistId: number | null) => {
    setSelectedArtist(artistId);
    setPage(1);
  };

  return (
    <div className="albums-page">
      <div className="page-header">
        <div>
          <h1>💿 Álbumes</h1>
          <p>Explora nuestra colección de álbumes musicales</p>
        </div>
        {!loading && <span className="chip">{albums.length} álbumes</span>}
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar álbumes..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />

        <div className="artist-filter">
          <select
            value={selectedArtist || ''}
            onChange={(e) => handleArtistChange(e.target.value ? Number(e.target.value) : null)}
            className="filter-select"
          >
            <option value="">Todos los artistas</option>
            {artists.map((artist) => (
              <option key={artist.ArtistId} value={artist.ArtistId}>
                {artist.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de álbumes */}
      {loading ? (
        <div className="loading-state">
          <p>Cargando álbumes...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={loadAlbums} className="btn">Reintentar</button>
        </div>
      ) : albums.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron álbumes</p>
        </div>
      ) : (
        <>
          <div className="albums-grid">
            {albums.map((album) => (
              <Link
                key={album.AlbumId}
                to={`/albums/${album.AlbumId}`}
                className="album-card"
              >
                <div className="album-cover">
                  <div className="album-placeholder">💿</div>
                </div>
                <div className="album-info">
                  <h3 className="album-title">{album.Title}</h3>
                  <p className="album-artist">{album.artist?.Name || 'Artista desconocido'}</p>
                </div>
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
              disabled={albums.length < pageSize}
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