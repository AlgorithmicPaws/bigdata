import { useState, useEffect } from 'react';
import type { TrackList, TrackDetail } from "../api/types";
import { getTracksPaginated } from "../api/endpoints/tracks"; // Cambiar aquí

function TracksPage() {
  const [trackList, setTrackList] = useState<TrackList>({
    tracks: [],
    total: 0,
    page: 1,
    page_size: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  async function loadTracks() {
    try {
      setLoading(true);
      setError(null);
      const data = await getTracksPaginated({ // Cambiar aquí
        page,
        page_size: 50,
        search: search || undefined,
      });
      setTrackList(data); // Ahora 'data' es TrackList completo
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading tracks";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Tracks</h2>
          <p className="card-subtitle">Browse and add new songs to the store.</p>
        </div>
        <span className="chip">
          {trackList.total} track{trackList.total !== 1 && "s"}
        </span>
      </div>

      <div style={{ padding: "1rem" }}>
        <input
          className="form-input"
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div>
        {loading ? (
          <p style={{ padding: "1rem" }}>Loading tracks...</p>
        ) : error ? (
          <p className="error-text" style={{ padding: "1rem" }}>{error}</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Genre</th>
                  <th>Composer</th>
                  <th>Duration</th>
                  <th>Unit price</th>
                </tr>
              </thead>
              <tbody>
                {trackList.tracks.map((t: TrackDetail) => (
                  <tr key={t.TrackId}>
                    <td>{t.TrackId}</td>
                    <td>{t.Name}</td>
                    <td>{t.artist_name || "—"}</td>
                    <td>{t.album?.Title || "—"}</td>
                    <td>{t.genre_name || "—"}</td>
                    <td>{t.Composer || "—"}</td>
                    <td>
                      {Math.floor(t.Milliseconds / 60000)}:
                      {String(Math.floor((t.Milliseconds % 60000) / 1000)).padStart(2, '0')}
                    </td>
                    <td>${parseFloat(t.UnitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {trackList.total > trackList.page_size && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem', 
                padding: '1rem',
                alignItems: 'center'
              }}>
                <button
                  className="btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Anterior
                </button>
                <span>
                  Página {trackList.page} de {Math.ceil(trackList.total / trackList.page_size)}
                </span>
                <button
                  className="btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(trackList.total / trackList.page_size)}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TracksPage;