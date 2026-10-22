import type { Meta } from '../interfaces/meta';
import type { IntersectionsColumns, SimilairesMap } from '../interfaces/intersection';

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} : ${r.status}`);
  return r.json() as Promise<T>;
}

export const fetchMeta = () => getJson<Meta>('/data/meta.json');
export const fetchIntersections = () => getJson<IntersectionsColumns>('/data/intersections.json');
export const fetchSimilaires = () => getJson<SimilairesMap>('/data/similaires.json');