import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Chinook Music Store</h3>
          <p>Tu tienda de música en línea</p>
        </div>

        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/browse">Catálogo</a></li>
            <li><a href="/artists">Artistas</a></li>
            <li><a href="/albums">Álbumes</a></li>
            <li><a href="/genres">Géneros</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Soporte</h4>
          <ul>
            <li><a href="/customers">Clientes</a></li>
            <li><a href="/invoices">Historial de Compras</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Información</h4>
          <p>© {currentYear} Chinook Music Store</p>
          <p>Proyecto demostrativo - FastAPI + React</p>
        </div>
      </div>
    </footer>
  );
}