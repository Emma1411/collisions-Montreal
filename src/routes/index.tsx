import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, lazy: () => import('../pages/OverviewPage').then(m => ({ Component: m.default })) },
      { path: 'carte', lazy: () => import('../pages/HotspotsPage').then(m => ({ Component: m.default })) },
      { path: 'methodologie', lazy: () => import('../pages/MethodologyPage').then(m => ({ Component: m.default })) },
      { path: '*', lazy: () => import('../pages/NotFoundPage').then(m => ({ Component: m.default })) },
    ],
  },
]);