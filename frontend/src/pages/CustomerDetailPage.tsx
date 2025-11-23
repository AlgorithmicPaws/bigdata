import { useParams } from 'react-router-dom';

export default function CustomerDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalle de Cliente</h1>
      <p>Customer ID: {id}</p>
      <p>Página en construcción...</p>
    </div>
  );
}