import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAlbum } from '../api/endpoints/albums';
import { getTracks } from '../api/endpoints/tracks';
import type { AlbumDetail, TrackDetail } from '../api/types';
import AddToCartButton from '../components/cart/AddToCartButton';
import './AlbumDetailPage.css';

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [tracks, setTracks] = useState<TrackDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAlbumData(Number(id));
    }
  }, [id]);

  const loadAlbumData = async (albumId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [albumData, tracksData] = await Promise.all([
        getAlbum(albumId),
        getTracks({ album_id: albumId, page_size: 100 })
      ]);
      setAlbum(albumData);
      setTracks(tracksData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el álbum');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const total = tracks.reduce((sum, track) => sum + track.Milliseconds, 0);
    const minutes = Math.floor(total / 60000);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="album-detail-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="album-detail-error">
        <h2>❌ {error || 'Álbum no encontrado'}</h2>
        <button onClick={() => navigate('/albums')} className="btn">
          Volver a Álbumes
        </button>
      </div>
    );
  }

  return (
    <div className="album-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Volver
      </button>

      <div className="album-header">
        <div className="album-cover-large">
          <div className="album-placeholder-large">💿</div>
        </div>

        <div className="album-header-info">
          <span className="album-type">ÁLBUM</span>
          <h1>{album.Title}</h1>
          {album.artist && (
            <Link to={`/artists/${album.artist.ArtistId}`} className="artist-link">
              {album.artist.Name}
            </Link>
          )}
          <div className="album-stats">
            <span>{tracks.length} canciones</span>
            <span>•</span>
            <span>{getTotalDuration()}</span>
          </div>
        </div>
      </div>

      <div className="album-tracks">
        <h2>Canciones</h2>
        <div className="tracks-list">
          {tracks.map((track, index) => (
            <div key={track.TrackId} className="track-row">
              <div className="track-number">{index + 1}</div>
              <div className="track-info">
                <Link to={`/tracks/${track.TrackId}`} className="track-name">
                  {track.Name}
                </Link>
                {track.Composer && (
                  <p className="track-composer">{track.Composer}</p>
                )}
              </div>
              <div className="track-duration">
                {formatDuration(track.Milliseconds)}
              </div>
              <div className="track-price">
                ${parseFloat(track.UnitPrice).toFixed(2)}
              </div>
              <div className="track-action">
                <AddToCartButton track={track} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}