import { useMemo } from 'react';
import type { FeatureProps, InterCollection } from '../interfaces/map';
import type { InterStats } from '../utils/byIntersection';
import { dataset } from '../utils/datasetStore';

export function useMapData(stats: InterStats | null, seuil: number) {
  return useMemo(() => {
    const inters = dataset.intersections;
    if (!stats || !inters) return null;
    const features: InterCollection['features'] = [];
    let min = Infinity, max = 0;
    for (let i = 0; i < inters.n; i++) {
      const b = stats.blesses[i];
      if (b < seuil || b === 0) continue;
      const sev: FeatureProps['sev'] = stats.mortelles[i] > 0 ? 4 : stats.graves[i] > 0 ? 3 : 2;
      if (b < min) min = b;
      if (b > max) max = b;
      features.push({
        type: 'Feature', id: i,
        geometry: { type: 'Point', coordinates: [inters.lon[i], inters.lat[i]] },
        properties: { i, b, sev, n: stats.n[i] },
      });
    }
    const collection: InterCollection = { type: 'FeatureCollection', features };
    return { collection, count: features.length, min: features.length ? min : 0, max };
  }, [stats, seuil]);
}