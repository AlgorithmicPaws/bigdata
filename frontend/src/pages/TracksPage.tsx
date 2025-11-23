import { type FormEvent, useEffect, useState } from "react";
import type { Track, TrackCreate } from "../api/types";
import { getTracks, createTrack } from "../api/tracks";

function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<TrackCreate>({
    Name: "",
    Composer: "",
    UnitPrice: 0.99,
  });

  async function loadTracks() {
    try {
      setLoading(true);
      setError(null);
      const data = await getTracks();
      setTracks(data);
    } catch (err: any) {
      setError(err.message ?? "Error loading tracks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTracks();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await createTrack({
        ...form,
        UnitPrice: Number(form.UnitPrice),
      });
      setForm({ Name: "", Composer: "", UnitPrice: 0.99 });
      await loadTracks();
    } catch (err: any) {
      setError(err.message ?? "Error creating track");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Tracks</h2>
          <p className="card-subtitle">Browse and add new songs to the store.</p>
        </div>
        <span className="chip">
          {tracks.length} track{tracks.length !== 1 && "s"}
        </span>
      </div>

      <div className="split-layout">
        {/* Lista */}
        <div>
          {loading ? (
            <p>Loading tracks...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Composer</th>
                  <th>Unit price</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((t) => (
                  <tr key={t.TrackId}>
                    <td>{t.TrackId}</td>
                    <td>{t.Name}</td>
                    <td>{t.Composer || "—"}</td>
                    <td>${t.UnitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Formulario */}
        <div>
          <h3 className="card-title" style={{ marginBottom: "0.8rem" }}>
            New track
          </h3>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">Composer (optional)</label>
              <input
                className="form-input"
                value={form.Composer}
                onChange={(e) =>
                  setForm({ ...form, Composer: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label className="form-label">Unit price (USD)</label>
              <input
                className="form-input"
                type="number"
                min={0}
                step={0.01}
                value={form.UnitPrice}
                onChange={(e) =>
                  setForm({ ...form, UnitPrice: Number(e.target.value) })
                }
                required
              />
            </div>

            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save track"}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default TracksPage;
