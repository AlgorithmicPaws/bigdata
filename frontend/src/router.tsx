import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import TrackDetailPage from './pages/TrackDetailPage';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import GenresPage from './pages/GenresPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
// import StatsPage from './pages/StatsPage';  ← QUITAR ESTE IMPORT

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'browse',
        element: <BrowsePage />,
      },
      {
        path: 'tracks/:id',
        element: <TrackDetailPage />,
      },
      {
        path: 'albums',
        element: <AlbumsPage />,
      },
      {
        path: 'albums/:id',
        element: <AlbumDetailPage />,
      },
      {
        path: 'artists',
        element: <ArtistsPage />,
      },
      {
        path: 'artists/:id',
        element: <ArtistDetailPage />,
      },
      {
        path: 'genres',
        element: <GenresPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
      {
        path: 'invoices',
        element: <InvoicesPage />,
      },
      {
        path: 'invoices/:id',
        element: <InvoiceDetailPage />,
      },
      // ← QUITAR ESTA RUTA
      // {
      //   path: 'stats',
      //   element: <StatsPage />,
      // },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);