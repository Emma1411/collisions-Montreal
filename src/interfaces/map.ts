import type { FeatureCollection, Point } from 'geojson';

export type MapMode = 'points' | 'chaleur';
export interface FeatureProps { i: number; b: number; sev: 2 | 3 | 4; n: number }
export type InterCollection = FeatureCollection<Point, FeatureProps>;