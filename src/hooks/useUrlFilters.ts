import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';
import { writeFilters } from '../utils/filtersUrl';

export function useUrlFilters() {
  const filters = useAppSelector(s => s.filters);
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const latest = useRef({ params, setParams });

  useEffect(() => {
    latest.current = { params, setParams };
  });

  useEffect(() => {
    const { params: current, setParams: set } = latest.current;
    const next = new URLSearchParams(current);
    writeFilters(next, filters);
    if (next.toString() !== current.toString()) set(next, { replace: true });
  }, [filters, pathname]);
}