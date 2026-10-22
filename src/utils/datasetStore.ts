import type { CollisionColumns } from '../interfaces/collision';
import type { IntersectionsColumns, SimilairesMap } from '../interfaces/intersection';

export const dataset: {
  collisions: CollisionColumns | null;
  intersections: IntersectionsColumns | null;
  similaires: SimilairesMap | null;
} = { collisions: null, intersections: null, similaires: null };