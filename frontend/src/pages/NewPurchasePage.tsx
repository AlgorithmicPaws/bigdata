import { type FormEvent, useEffect, useState } from "react";
import type { Customer, Track } from "../api/types";
import { getCustomers } from "../api/customers";
import { getTracks } from "../api/tracks";
import { registerPurchase } from "../api/purchases";

function NewPurchasePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  const [customerId, setCustomerId] = useState<number | "">("");
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [billingAddress, setBillingAddress] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    purchase_id: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [c, t] = await Promise.all([getCustomers(), getTracks()]);
        setCustomers(c);
        setTracks(t);
      } catch (err: any) {
        setError(err.message ?? "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleTrack(id: number) {
    setSelectedTracks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!customerId || selectedTracks.length === 0) {
      setError("Select a customer and at least one track.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setResult(null);

      const payload = {
        customer_id: Number(customerId),
        employee_id: employeeId ? Number(employeeId) : undefined,
        billing_address: billingAddress || undefined,
        track_ids: selectedTracks,
      };

      const res = await registerPurchase(payload);
      setResult({ purchase_id: res.purchase_id, total: res.total });
      setSelectedTracks([]);
      setBillingAddress("");
      setEmployeeId("");
      // customerId se mantiene por si quieres registrar varias compras al mismo cliente
    } catch (err: any) {
      setError(err.message ?? "Error registering purchase");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p>Loading customers and tracks...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">New purchase</h2>
          <p className="card-subtitle">
            Select a customer and one or more tracks to register a purchase.
          </p>
        </div>
        <span className="chip">
          {tracks.length} tracks · {customers.length} customers
        </span>
      </div>

      <div className="split-layout">
        {/* Form */}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Customer</label>
            <select
              className="form-select"
              value={customerId}
              onChange={(e) =>
                setCustomerId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              required
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.CustomerId} value={c.CustomerId}>
                  {c.FirstName} {c.LastName} ({c.Email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Employee ID (optional)</label>
            <input
              className="form-input"
              type="number"
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            />
          </div>

          <div className="form-row">
            <label className="form-label">Billing address (optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Registering..." : "Register purchase"}
          </button>

          {error && <p className="error-text">{error}</p>}
          {result && (
            <p className="status-line badge-success">
              Purchase #{result.purchase_id} created · Total: $
              {result.total.toFixed(2)}
            </p>
          )}
        </form>

        {/* Selección de tracks */}
        <div>
          <h3 className="card-title" style={{ marginBottom: "0.8rem" }}>
            Select tracks
          </h3>
          <p className="helper-text" style={{ marginBottom: "0.8rem" }}>
            Click on a track to add or remove it from the purchase.
          </p>
          <div
            style={{
              maxHeight: 380,
              overflow: "auto",
              borderRadius: 12,
              border: "1px solid rgba(30,64,175,0.5)",
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Composer</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((t) => {
                  const selected = selectedTracks.includes(t.TrackId);
                  return (
                    <tr
                      key={t.TrackId}
                      onClick={() => toggleTrack(t.TrackId)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: selected
                          ? "rgba(79,70,229,0.2)"
                          : undefined,
                      }}
                    >
                      <td>
                        <input type="checkbox" checked={selected} readOnly />
                      </td>
                      <td>{t.Name}</td>
                      <td>{t.Composer || "—"}</td>
                      <td>${t.UnitPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="status-line">
            {selectedTracks.length} track
            {selectedTracks.length !== 1 && "s"} selected.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewPurchasePage;
