import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import TracksPage from "./pages/TracksPage";
import NewPurchasePage from "./pages/NewPurchasePage";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">🎵 Online Music Store</div>
        <nav className="nav">
          <NavLink to="/tracks" className="nav-link">
            Tracks
          </NavLink>
          <NavLink to="/customers" className="nav-link">
            Customers
          </NavLink>
          <NavLink to="/purchases/new" className="nav-link">
            New Purchase
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/tracks" replace />} />
          <Route path="/tracks" element={<TracksPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/purchases/new" element={<NewPurchasePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
