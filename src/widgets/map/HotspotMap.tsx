import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type {
  ExpressionSpecification,
  GeoJSONSource,
  Map as MLMap,
  MapLayerMouseEvent,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { FeatureProps, InterCollection, MapMode } from '../../interfaces/map';
import { COLORS } from '../../utils/colors';
import { dataset } from '../../utils/datasetStore';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';


maplibregl.setWorkerUrl(workerUrl);

const STYLE = 'https://tiles.openfreemap.org/styles/positron';
const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] };
const LAYERS = ['inter-points', 'inter-hit'];

const FR = {
  'NavigationControl.ZoomIn': 'Zoom avant',
  'NavigationControl.ZoomOut': 'Zoom arrière',
  'CooperativeGesturesHandler.WindowsHelpText': 'Utilisez Ctrl + molette pour zoomer la carte',
  'CooperativeGesturesHandler.MacHelpText': 'Utilisez ⌘ + molette pour zoomer la carte',
  'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte',
};

const RADIUS: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  10,
  ['interpolate', ['linear'], ['get', 'b'], 1, 2.5, 10, 4, 50, 8, 150, 13],
  15,
  ['interpolate', ['linear'], ['get', 'b'], 1, 5, 10, 8, 50, 15, 150, 26],
];

const COLOR: ExpressionSpecification = [
  'match',
  ['get', 'sev'],
  4,
  COLORS.mortel,
  3,
  COLORS.grave,
  COLORS.leger,
];

function popupNode(p: FeatureProps): HTMLElement {
  const root = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = dataset.intersections!.nom[p.i];

  const line = document.createElement('div');
  line.textContent = `${p.b} collision${p.b > 1 ? 's' : ''} avec blessés`;

  root.append(title, line);
  return root;
}

interface Props {
  data: InterCollection;
  mode: MapMode;
  selected: number | null;
  onSelect: (i: number | null) => void;
  bounds: [[number, number], [number, number]];
}

export default function HotspotMap({
  data,
  mode,
  selected,
  onSelect,
  bounds,
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);

  const [ready, setReady] = useState(false);
  const [fail, setFail] = useState(false);

  // Valeurs récentes lues par les gestionnaires d'événements,
  // sans recréer la carte.
  const latest = useRef({ data, onSelect, bounds });

  useEffect(() => {
    latest.current = { data, onSelect, bounds };
  });

  useEffect(() => {
    if (!box.current) return;

    const small = window.matchMedia('(max-width: 1023px)').matches;

    const map = new maplibregl.Map({
      container: box.current,
      style: STYLE,
      bounds: latest.current.bounds,
      fitBoundsOptions: { padding: 24 },
      minZoom: 8,
      maxZoom: 18,
      dragRotate: false,
      pitchWithRotate: false,
      cooperativeGestures: small,
      locale: FR,
    });

    map.touchZoomRotate.disableRotation();

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right',
    );

    mapRef.current = map;

    let loaded = false;

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(box.current);

    map.on('error', (e) => {
      console.error('Carte :', e.error);
      if (!loaded) setFail(true);
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: 'carte-popup',
    });

    map.on('load', () => {
      loaded = true;
      setFail(false);

      map.addSource('inter', {
        type: 'geojson',
        data: latest.current.data,
      });

      map.addSource('sel', {
        type: 'geojson',
        data: EMPTY,
      });

      map.addLayer({
        id: 'inter-heat',
        type: 'heatmap',
        source: 'inter',
        layout: { visibility: 'none' },
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'b'],
            1,
            0.15,
            30,
            0.6,
            100,
            1,
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9,
            0.6,
            15,
            1.6,
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9,
            10,
            13,
            22,
            16,
            40,
          ],
          'heatmap-opacity': 0.85,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(11,92,147,0)',
            0.2,
            'rgba(147,197,253,0.55)',
            0.5,
            'rgba(59,130,246,0.75)',
            0.8,
            'rgba(11,92,147,0.9)',
            1,
            'rgba(8,43,77,1)',
          ],
        },
      });

      map.addLayer({
        id: 'inter-points',
        type: 'circle',
        source: 'inter',
        paint: {
          'circle-radius': RADIUS,
          'circle-color': COLOR,
          'circle-opacity': 0.85,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
        },
      });

      // Couche invisible : permet de survoler et de cliquer
      // en mode « zones chaudes ».
      map.addLayer({
        id: 'inter-hit',
        type: 'circle',
        source: 'inter',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 12,
          'circle-opacity': 0,
        },
      });

      map.addLayer({
        id: 'sel-ring',
        type: 'circle',
        source: 'sel',
        paint: {
          'circle-radius': 15,
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-width': 3,
          'circle-stroke-color': COLORS.ink,
        },
      });

      for (const id of LAYERS) {
        map.on('mousemove', id, (e: MapLayerMouseEvent) => {
          const f = e.features?.[0] as Feature<Point> | undefined;
          if (!f) return;

          map.getCanvas().style.cursor = 'pointer';

          popup
            .setLngLat(f.geometry.coordinates as [number, number])
            .setDOMContent(
              popupNode(f.properties as unknown as FeatureProps),
            )
            .addTo(map);
        });

        map.on('mouseleave', id, () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        map.on('click', id, (e: MapLayerMouseEvent) => {
          const f = e.features?.[0];

          if (f) {
            latest.current.onSelect(
              (f.properties as unknown as FeatureProps).i,
            );
          }
        });
      }

      map.on('click', (e) => {
        if (
          map.queryRenderedFeatures(e.point, { layers: LAYERS }).length === 0
        ) {
          latest.current.onSelect(null);
        }
      });

      setReady(true);
    });

    return () => {
      ro.disconnect();
      popup.remove();
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (map && ready) {
      (map.getSource('inter') as GeoJSONSource).setData(data);
    }
  }, [data, ready]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !ready) return;

    const heat = mode === 'chaleur';

    map.setLayoutProperty(
      'inter-heat',
      'visibility',
      heat ? 'visible' : 'none',
    );

    map.setLayoutProperty(
      'inter-points',
      'visibility',
      heat ? 'none' : 'visible',
    );

    map.setLayoutProperty(
      'inter-hit',
      'visibility',
      heat ? 'visible' : 'none',
    );
  }, [mode, ready]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !ready) return;

    const src = map.getSource('sel') as GeoJSONSource;

    if (selected === null) {
      src.setData(EMPTY);
      return;
    }

    const inters = dataset.intersections!;
    const c: [number, number] = [
      inters.lon[selected],
      inters.lat[selected],
    ];

    src.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: c,
      },
    });

    if (!map.getBounds().contains(c) || map.getZoom() < 13) {
      map.easeTo({
        center: c,
        zoom: Math.max(map.getZoom(), 14.5),
        duration: 700,
      });
    }
  }, [selected, ready]);

  return (
    <div className="absolute inset-0">
      <div
        ref={box}
        className="h-full w-full"
        role="region"
        aria-label="Carte des intersections avec collisions"
      />

      {fail && (
        <p
          role="alert"
          className="absolute inset-x-4 top-4 z-10 mx-auto w-fit max-w-md rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-card"
        >
          Le fond de carte n’a pas pu être chargé. Vérifiez votre connexion,
          puis rechargez la page.
        </p>
      )}
    </div>
  );
}
