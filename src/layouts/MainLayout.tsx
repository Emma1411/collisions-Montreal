import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DatasetGate from '../components/layout/DatasetGate';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { loadDataset } from '../thunks/loadDataset';

export default function MainLayout() {
  const dispatch = useAppDispatch();
  useUrlFilters();

  useEffect(() => {
    dispatch(loadDataset());
  }, [dispatch]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow-card"
      >
        Aller au contenu
      </a>
      <Navbar />
      <main id="contenu" className="flex-1">
        <DatasetGate>
          <Outlet />
        </DatasetGate>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}