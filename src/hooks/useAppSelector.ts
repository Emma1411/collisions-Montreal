import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../rootReducers';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;