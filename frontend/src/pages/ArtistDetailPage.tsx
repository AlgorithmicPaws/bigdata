import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArtist } from '../api/endpoints/artists';
import { getAlbums } from '../api/endpoints/albums';
import type { Artist, AlbumDetail } from '../api/types';
import './ArtistDetailPage.css';

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<AlbumDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArtistData(Number(id));
    }
  }, [id]);

  const loadArtistData = async (artistId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [artistData, albumsData] = await Promise.all([
        getArtist(artistId),
        getAlbums({ artist_id: artistId, page_size: 100 })
      ]);
      setArtist(artistData);
      setAlbums(albumsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el artista');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="artist-detail-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="artist-detail-error">
        <h2>❌ {error || 'Artista no encontrado'}</h2>
        <button onClick={() => navigate('/artists')} className="btn">
          Volver a Artistas
        </button>
      </div>
    );
  }

  return (
    <div className="artist-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Volver
      </button>

      <div className="artist-header">
        <div className="artist-avatar-large">
          <span className="artist-initial-large">
            {artist.Name?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>

        <div className="artist-header-info">
          <span className="artist-type">ARTISTA</span>
          <h1>{artist.Name || 'Artista desconocido'}</h1>
          <div className="artist-stats">
            <span>{albums.length} álbumes</span>
          </div>
        </div>
      </div>

      <div className="artist-albums">
        <h2>Discografía</h2>
        {albums.length === 0 ? (
          <div className="empty-message">
            <p>No hay álbumes disponibles de este artista</p>
          </div>
        ) : (
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}