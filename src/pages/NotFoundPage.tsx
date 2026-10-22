import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="section-title">Page introuvable</h1>
      <Link to="/" className="btn-primary">Retour à la Vue d’ensemble</Link>
    </div>
  );
}