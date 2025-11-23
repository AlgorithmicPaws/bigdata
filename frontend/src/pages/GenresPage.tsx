import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres } from '../api/endpoints/genres';
import type { Genre } from '../api/types';
import './GenresPage.css';

export default function GenresPage() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGenres();
      setGenres(data.genres);
    } catch (err: any) {
      setError(err.message || 'Error al cargar géneros');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genreId: number) => {
    navigate(`/browse?genre=${genreId}`);
  };

  const genreEmojis: { [key: string]: string } = {
    'Rock': '🎸',
    'Jazz': '🎺',
    'Metal': '🤘',
    'Alternative': '🎵',
    'Classical': '🎻',
    'Blues': '🎹',
    'Latin': '🎺',
    'Reggae': '🌴',
    'Pop': '🎤',
    'Hip Hop': '🎧',
    'Rap': '🎤',
    'Electronic': '🎛️',
    'R&B': '🎶',
    'Soul': '💿',
    'Punk': '⚡',
    'Country': '🤠',
    'World': '🌍',
  };

  const getGenreEmoji = (genreName: string | null) => {
    if (!genreName) return '🎵';
    for (const [key, emoji] of Object.entries(genreEmojis)) {
      if (genreName.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
    return '🎵';
  };

  if (loading) {
    return (
      <div className="genres-loading">
        <p>Cargando géneros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="genres-error">
        <p>❌ {error}</p>
        <button onClick={loadGenres} className="btn">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="genres-page">
      <div className="page-header">
        <div>
          <h1>🎼 Géneros Musicales</h1>
          <p>Explora música por género</p>
        </div>
        <span className="chip">{genres.length} géneros</span>
      </div>

      <div className="genres-grid">
        {genres.map((genre) => (
          <button
            key={genre.GenreId}
            onClick={() => handleGenreClick(genre.GenreId)}
            className="genre-card"
          >
            <div className="genre-icon">
              {getGenreEmoji(genre.Name)}
            </div>
            <h3 className="genre-name">{genre.Name || 'Sin nombre'}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}