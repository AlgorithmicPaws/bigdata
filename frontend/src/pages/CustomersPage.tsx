import { type FormEvent, useEffect, useState } from "react";

import type {
    Customer,
    CustomerCreate,
    CustomerPurchaseHistoryItem,
} from "../api/types";
import {
  createCustomer,
  getCustomerHistory,
  getCustomers,
} from "../api/endpoints/customers";

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [history, setHistory] = useState<CustomerPurchaseHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerCreate>({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    SupportRepId: undefined,
  });

  async function loadCustomers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message ?? "Error loading customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload: CustomerCreate = {
        ...form,
        SupportRepId: form.SupportRepId ? Number(form.SupportRepId) : undefined,
      };
      await createCustomer(payload);
      setForm({
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        SupportRepId: undefined,
      });
      await loadCustomers();
    } catch (err: any) {
      setError(err.message ?? "Error creating customer");
    } finally {
      setSaving(false);
    }
  }

  async function loadHistory(c: Customer) {
    try {
      setSelectedCustomer(c);
      setHistory([]);
      setHistoryError(null);
      setHistoryLoading(true);
      const data = await getCustomerHistory(c.CustomerId);
      setHistory(data);
    } catch (err: any) {
      setHistoryError(err.message ?? "Error loading history");
    } finally {
      setHistoryLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Customers</h2>
          <p className="card-subtitle">
            Manage your customers and see their purchase history.
          </p>
        </div>
        <span className="chip">
          {customers.length} customer{customers.length !== 1 && "s"}
        </span>
      </div>

      <div className="split-layout">
        {/* Lista de clientes */}
        <div>
          {loading ? (
            <p>Loading customers...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.CustomerId}>
                    <td>{c.CustomerId}</td>
                    <td>
                      {c.FirstName} {c.LastName}
                    </td>
                    <td>{c.Email}</td>
                    <td>{c.Phone || "—"}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => loadHistory(c)}
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedCustomer && (
            <div style={{ marginTop: "1rem" }}>
              <h4 className="card-title" style={{ fontSize: "1rem" }}>
                Purchase history of {selectedCustomer.FirstName}{" "}
                {selectedCustomer.LastName}
              </h4>
              {historyLoading ? (
                <p>Loading history...</p>
              ) : historyError ? (
                <p className="error-text">{historyError}</p>
              ) : history.length === 0 ? (
                <p className="helper-text">No purchases yet.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Purchase ID</th>
                      <th>Employee</th>
                      <th>Billing address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.purchase_id}>
                        <td>{h.purchase_id}</td>
                        <td>{h.employee_id ?? "—"}</td>
                        <td>{h.billing_address ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Formulario de nuevo cliente */}
        <div>
          <h3 className="card-title" style={{ marginBottom: "0.8rem" }}>
            New customer
          </h3>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">First name</label>
              <input
                className="form-input"
                value={form.FirstName}
                onChange={(e) =>
                  setForm({ ...form, FirstName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">Last name</label>
              <input
                className="form-input"
                value={form.LastName}
                onChange={(e) =>
                  setForm({ ...form, LastName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={form.Email}
                onChange={(e) =>
                  setForm({ ...form, Email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">Phone (optional)</label>
              <input
                className="form-input"
                value={form.Phone || ""}
                onChange={(e) => setForm({ ...form, Phone: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Support rep ID (optional)</label>
              <input
                className="form-input"
                type="number"
                value={form.SupportRepId ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    SupportRepId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <span className="helper-text">
                Leave empty if the customer has no assigned rep.
              </span>
            </div>

            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save customer"}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
