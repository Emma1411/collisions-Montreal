import { combineReducers } from '@reduxjs/toolkit';
import dataset from './slices/datasetSlice';
import filters from './slices/filtersSlice';

export const rootReducer = combineReducers({ dataset, filters });
export type RootState = ReturnType<typeof rootReducer>;