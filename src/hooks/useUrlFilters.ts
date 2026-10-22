import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';
import { writeFilters } from '../utils/filtersUrl';

export function useUrlFilters() {
  const filters = useAppSelector(s => s.filters);
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const next = new URLSearchParams(params);
    writeFilters(next, filters);
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [filters, pathname]); 
}