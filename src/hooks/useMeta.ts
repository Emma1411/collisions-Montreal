import type { Meta } from '../interfaces/meta';
import { useAppSelector } from './useAppSelector';

export function useMeta(): Meta {
  const meta = useAppSelector(s => s.dataset.meta);
  if (!meta) throw new Error('useMeta doit être utilisé sous <DatasetGate>');
  return meta;
}