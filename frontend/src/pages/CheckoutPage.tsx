import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCustomers, createCustomer } from '../api/endpoints/customers';
import { createInvoice } from '../api/endpoints/invoices'; // Cambiado
import type { Customer, CustomerCreate, InvoiceCreate } from '../api/types'; // Agregado InvoiceCreate
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  
  const [employeeId, setEmployeeId] = useState<number | ''>('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingCountry, setBillingCountry] = useState('');

  const [newCustomer, setNewCustomer] = useState<CustomerCreate>({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Address: '',
    City: '',
    Country: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    loadCustomers();
  }, [items, navigate]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers({ page_size: 100 });
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const customer = await createCustomer(newCustomer);
      setCustomers([...customers, customer]);
      setSelectedCustomerId(customer.CustomerId);
      setShowNewCustomerForm(false);
      setNewCustomer({
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: '',
        Address: '',
        City: '',
        Country: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
    } finally {
      setSubmitting(false);
    }
  };

const handleSubmitPurchase = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedCustomerId) {
    setError('Por favor selecciona un cliente');
    return;
  }

  try {
    setSubmitting(true);
    setError(null);

    // Crear el payload con TODOS los campos de facturación
    const invoiceData: InvoiceCreate = {
      CustomerId: Number(selectedCustomerId),
      EmployeeId: employeeId ? Number(employeeId) : undefined,
      BillingAddress: billingAddress || undefined,
      BillingCity: billingCity || undefined,
      BillingCountry: billingCountry || undefined,
      BillingState: undefined, // No tenemos este campo en el form
      BillingPostalCode: undefined, // No tenemos este campo en el form
      items: items.map(item => ({
        TrackId: item.track.TrackId,
        Quantity: item.quantity,
      })),
    };

    const result = await createInvoice(invoiceData);
    
    // Limpiar carrito y navegar a la página de éxito
    clearCart();
    navigate(`/invoices/${result.InvoiceId}`, {
      state: { success: true, total: parseFloat(result.Total) }
    });
  } catch (err: any) {
    console.error('Error al procesar la compra:', err);
    setError(err.detail?.detail || err.message || 'Error al procesar la compra');
  } finally {
    setSubmitting(false);
  }
};
  if (loading) {
    return (
      <div className="checkout-loading">
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>

      <div className="checkout-content">
        {/* Formulario de compra */}
        <div className="checkout-form">
          <form onSubmit={handleSubmitPurchase}>
            {/* Selección de cliente */}
            <section className="form-section">
              <h2>1. Información del Cliente</h2>
              
              {!showNewCustomerForm ? (
                <>
                  <div className="form-group">
                    <label>Seleccionar Cliente</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : '')}
                      required
                      className="form-control"
                    >
                      <option value="">Selecciona un cliente...</option>
                      {customers.map((customer) => (
                        <option key={customer.CustomerId} value={customer.CustomerId}>
                          {customer.FirstName} {customer.LastName} - {customer.Email}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowNewCustomerForm(true)}
                    className="btn btn-secondary"
                  >
                    + Crear Nuevo Cliente
                  </button>
                </>
              ) : (
                <div className="new-customer-form">
                  <h3>Nuevo Cliente</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        value={newCustomer.FirstName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, FirstName: e.target.value })}
                        required
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Apellido *</label>
                      <input
                        type="text"
                        value={newCustomer.LastName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, LastName: e.target.value })}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={newCustomer.Email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, Email: e.target.value })}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={newCustomer.Phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, Phone: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleCreateCustomer}
                      disabled={submitting}
                      className="btn btn-primary"
                    >
                      {submitting ? 'Creando...' : 'Crear Cliente'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCustomerForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Información de facturación */}
            <section className="form-section">
              <h2>2. Información de Facturación (Opcional)</h2>
              
              <div className="form-group">
                <label>ID del Empleado que asiste</label>
                <input
                  type="number"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value ? Number(e.target.value) : '')}
                  className="form-control"
                  placeholder="Dejar vacío si es autoservicio"
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>País</label>
                  <input
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !selectedCustomerId}
              className="btn btn-primary btn-large"
            >
              {submitting ? 'Procesando...' : `Confirmar Compra - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="order-summary">
          <h2>Resumen del Pedido</h2>
          
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.track.TrackId} className="summary-item">
                <div className="item-info">
                  <p className="item-name">{item.track.Name}</p>
                  <p className="item-artist">{item.track.artist_name}</p>
                  <p className="item-qty">Cantidad: {item.quantity}</p>
                </div>
                <p className="item-price">
                  ${(parseFloat(item.track.UnitPrice) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal ({itemCount} items):</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Impuestos:</span>
            <span>$0.00</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="summary-note">
            <p>💳 Nota: Esta es una compra demostrativa. No se procesará ningún pago real.</p>
          </div>
        </div>
      </div>
    </div>
  );
}