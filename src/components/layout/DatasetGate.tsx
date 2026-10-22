import type { ReactNode } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { loadDataset } from '../../thunks/loadDataset';

export default function DatasetGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(s => s.dataset.status);
  const error = useAppSelector(s => s.dataset.error);

  if (status === 'error') {
    return (
      <div role="alert" className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-ink-muted">Impossible de charger les données{error ? ` (${error})` : ''}.</p>
        <button type="button" className="btn-primary" onClick={() => dispatch(loadDataset())}>
          Réessayer
        </button>
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div role="status" className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-ink-muted">
        <span className="size-6 animate-spin rounded-full border-2 border-line border-t-brand" aria-hidden />
        Chargement des données…
      </div>
    );
  }

  return <>{children}</>;
}