import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTrack } from '../api/endpoints/tracks';
import type { TrackDetail } from '../api/types';
import AddToCartButton from '../components/cart/AddToCartButton';
import './TrackDetailPage.css';

export default function TrackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTrack(Number(id));
    }
  }, [id]);

  const loadTrack = async (trackId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrack(trackId);
      setTrack(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la canción');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="track-detail-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="track-detail-error">
        <h2>❌ {error || 'Canción no encontrada'}</h2>
        <button onClick={() => navigate('/browse')} className="btn">
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="track-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Volver
      </button>

      <div className="track-detail-content">
        {/* Imagen del track */}
        <div className="track-image-large">
          <div className="track-placeholder-large">🎵</div>
        </div>

        {/* Información principal */}
        <div className="track-main-info">
          <div className="track-header">
            <span className="track-type">CANCIÓN</span>
            <h1>{track.Name}</h1>
            <div className="track-artists">
              {track.artist_name && (
                <Link to={`/artists/${track.album?.ArtistId}`} className="artist-link">
                  {track.artist_name}
                </Link>
              )}
            </div>
          </div>

          <div className="track-actions-row">
            <AddToCartButton track={track} className="btn-large" />
            <p className="track-price-large">${parseFloat(track.UnitPrice).toFixed(2)}</p>
          </div>

          {/* Información del álbum */}
          {track.album && (
            <div className="track-album-info">
              <h3>Del álbum</h3>
              <Link to={`/albums/${track.AlbumId}`} className="album-card">
                <div className="album-thumb">💿</div>
                <div>
                  <p className="album-title">{track.album.Title}</p>
                  <p className="album-artist">{track.artist_name}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Detalles técnicos */}
          <div className="track-details">
            <h3>Detalles</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Duración</span>
                <span className="detail-value">{formatDuration(track.Milliseconds)}</span>
              </div>
              
              {track.genre_name && (
                <div className="detail-item">
                  <span className="detail-label">Género</span>
                  <span className="detail-value">{track.genre_name}</span>
                </div>
              )}
              
              {track.Composer && (
                <div className="detail-item">
                  <span className="detail-label">Compositor</span>
                  <span className="detail-value">{track.Composer}</span>
                </div>
              )}
              
              <div className="detail-item">
                <span className="detail-label">Track ID</span>
                <span className="detail-value">#{track.TrackId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}