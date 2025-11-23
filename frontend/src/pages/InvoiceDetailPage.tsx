import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getInvoice } from '../api/endpoints/invoices';
import type { InvoiceDetail } from '../api/types';
import './InvoiceDetailPage.css';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si viene de un checkout exitoso
  const isSuccess = location.state?.success;

  useEffect(() => {
    if (id) {
      loadInvoice(Number(id));
    }
  }, [id]);

  const loadInvoice = async (invoiceId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInvoice(invoiceId);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la factura');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="invoice-detail-loading">
        <p>Cargando factura...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="invoice-detail-error">
        <h2>❌ {error || 'Factura no encontrada'}</h2>
        <button onClick={() => navigate('/invoices')} className="btn">
          Volver a Facturas
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-detail-page">
      {isSuccess && (
        <div className="success-banner">
          <h2>✅ ¡Compra realizada con éxito!</h2>
          <p>Tu factura ha sido generada correctamente</p>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="back-button">
        ← Volver
      </button>

      <div className="invoice-container">
        {/* Header */}
        <div className="invoice-header">
          <div>
            <h1>Factura #{invoice.InvoiceId}</h1>
            <p className="invoice-date">{formatDate(invoice.InvoiceDate)}</p>
          </div>
          <div className="invoice-total-badge">
            <span className="total-label">Total</span>
            <span className="total-amount">${parseFloat(invoice.Total).toFixed(2)}</span>
          </div>
        </div>

        {/* Info del cliente */}
        <div className="invoice-info-section">
          <div className="info-card">
            <h3>Cliente</h3>
            <p className="customer-name">{invoice.customer_name || `Cliente #${invoice.CustomerId}`}</p>
          </div>

          {invoice.employee_name && (
            <div className="info-card">
              <h3>Atendido por</h3>
              <p>{invoice.employee_name}</p>
            </div>
          )}

          {invoice.BillingAddress && (
            <div className="info-card">
              <h3>Dirección de Facturación</h3>
              <p>{invoice.BillingAddress}</p>
              {invoice.BillingCity && <p>{invoice.BillingCity}</p>}
              {invoice.BillingState && <p>{invoice.BillingState}</p>}
              {invoice.BillingCountry && <p>{invoice.BillingCountry}</p>}
              {invoice.BillingPostalCode && <p>{invoice.BillingPostalCode}</p>}
            </div>
          )}
        </div>

        {/* Items de la factura */}
        <div className="invoice-items">
          <h2>Artículos</h2>
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Canción</th>
                  <th>Artista</th>
                  <th>Álbum</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.InvoiceLineId}>
                    <td>{index + 1}</td>
                    <td className="item-name">{item.track_name || 'N/A'}</td>
                    <td>{item.artist_name || '—'}</td>
                    <td>{item.album_title || '—'}</td>
                    <td className="text-center">{item.Quantity}</td>
                    <td className="item-price">${parseFloat(item.UnitPrice).toFixed(2)}</td>
                    <td className="item-subtotal">
                      ${(parseFloat(item.UnitPrice) * item.Quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="text-right"><strong>Total:</strong></td>
                  <td className="total-cell">${parseFloat(invoice.Total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div className="invoice-actions">
          <button onClick={() => navigate('/browse')} className="btn btn-primary">
            Continuar Comprando
          </button>
          <button onClick={() => navigate('/invoices')} className="btn btn-secondary">
            Ver Todas las Facturas
          </button>
        </div>
      </div>
    </div>
  );
}