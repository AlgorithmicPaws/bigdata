import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../api/endpoints/invoices';
import type { Invoice } from '../api/types';
import './InvoicesPage.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    loadInvoices();
  }, [page]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInvoices({
        page,
        page_size: pageSize,
      });
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="invoices-page">
      <div className="page-header">
        <div>
          <h1>🧾 Historial de Compras</h1>
          <p>Todas las facturas registradas en el sistema</p>
        </div>
        {!loading && <span className="chip">{invoices.length} facturas</span>}
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Cargando facturas...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={loadInvoices} className="btn">Reintentar</button>
        </div>
      ) : invoices.length === 0 ? (
        <div className="empty-state">
          <p>No hay facturas registradas</p>
        </div>
      ) : (
        <>
          <div className="invoices-table-container">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>País</th>
                  <th>Total</th>
                  <th>Empleado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.InvoiceId}>
                    <td className="invoice-id">#{invoice.InvoiceId}</td>
                    <td>{formatDate(invoice.InvoiceDate)}</td>
                    <td>Cliente #{invoice.CustomerId}</td>
                    <td>{invoice.BillingAddress || '—'}</td>
                    <td>{invoice.BillingCity || '—'}</td>
                    <td>{invoice.BillingCountry || '—'}</td>
                    <td className="invoice-total">${parseFloat(invoice.Total).toFixed(2)}</td>
                    <td>{invoice.EmployeeId ? `#${invoice.EmployeeId}` : '—'}</td>
                    <td>
                      <Link to={`/invoices/${invoice.InvoiceId}`} className="btn-view">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              disabled={invoices.length < pageSize}
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