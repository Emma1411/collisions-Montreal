import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import FilterControls from "../components/ui/FilterControls";
import Segmented from "../components/ui/Segmented";
import { useAppSelector } from "../hooks/useAppSelector";
import { useInterStats, useRanking } from "../hooks/useInterStats";
import { useMapData } from "../hooks/useMapData";
import { useMeta } from "../hooks/useMeta";
import type { MapMode } from "../interfaces/map";
import { dataset } from "../utils/datasetStore";
import { activeFilterCount, describeFilters } from "../utils/describeFilters";
import { fmtInt } from "../utils/format";
import { interParam, parseInterParam } from "../utils/intersections";
import HotspotMap from "../widgets/map/HotspotMap";
import MapLegend from "../widgets/map/MapLegend";
import MapPanel, { type PanelTab } from "../widgets/map/MapPanel";
import MapSearch from "../widgets/map/MapSearch";

export default function HotspotsPage() {
  const meta = useMeta();
  const f = useAppSelector((s) => s.filters);
  const [params, setParams] = useSearchParams();
  const stats = useInterStats();
  const ranking = useRanking(stats);

  const [seuil, setSeuil] = useState(10);
  const [mode, setMode] = useState<MapMode>("points");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tabChoice, setTabChoice] = useState<{
    sel: number | null;
    tab: PanelTab;
  } | null>(null);

  const map = useMapData(stats, seuil);

  const inters = dataset.intersections!;
  const selected = parseInterParam(inters, params.get("i"));

  const tab: PanelTab =
    tabChoice && tabChoice.sel === selected ? tabChoice.tab : "fiche";

  const select = useCallback(
    (i: number | null) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (i === null) {
            next.delete("i");
          } else {
            next.set("i", interParam(inters, i));
          }

          return next;
        },
        { replace: true },
      );
    },
    [setParams, inters],
  );

  const bounds = useMemo<[[number, number], [number, number]]>(
    () => [
      [meta.etendue.lon[0], meta.etendue.lat[0]],
      [meta.etendue.lon[1], meta.etendue.lat[1]],
    ],
    [meta],
  );

  if (!stats || !ranking || !map) return null;

  const nFiltres = activeFilterCount(f);

  return (
    <div className="flex min-h-0 flex-col lg:h-[calc(100dvh-var(--header-h))]">
      <div className="shrink-0 border-b border-line bg-white">
        <div className="page-container space-y-3 py-3">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <MapSearch stats={stats} onSelect={select} />

            <Segmented
              ariaLabel="Affichage de la carte"
              label="Affichage"
              value={mode}
              onChange={(v) => setMode(v as MapMode)}
              options={[
                {
                  value: "points",
                  label: "Points",
                  title: "Un cercle par intersection",
                },
                {
                  value: "chaleur",
                  label: "Zones chaudes",
                  title:
                    "Carte de chaleur : les zones foncées concentrent le plus de collisions avec blessés",
                },
              ]}
            />

            <Segmented
              ariaLabel="Seuil d’affichage"
              label="Montrer les intersections avec au moins"
              value={String(seuil)}
              onChange={(v) => setSeuil(Number(v))}
              options={[1, 5, 10, 20].map((n) => ({
                value: String(n),
                label: `${n} collision${n > 1 ? "s" : ""}`,
                title: `${n} collision${n > 1 ? "s" : ""} avec blessés`,
              }))}
            />

            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand/40 hover:text-brand"
            >
              <SlidersHorizontal className="size-3.5" aria-hidden />
              Filtres
              {nFiltres > 0 && (
                <span className="rounded-full bg-brand px-1.5 text-[11px] text-white">
                  {nFiltres}
                </span>
              )}
            </button>
          </div>

          {filtersOpen && (
            <div className="rounded-lg border border-line bg-canvas/60 p-3">
              <FilterControls />
            </div>
          )}

          <p className="text-sm text-ink-muted" aria-live="polite">
            Vous regardez :{" "}
            <strong className="font-semibold text-ink">
              {describeFilters(f, meta.annees)}
            </strong>
            .{" "}
            <AnimatedNumber
              value={map.count}
              className="font-semibold text-brand"
            />{" "}
            intersections affichées sur {fmtInt(inters.n)} (au moins {seuil}{" "}
            collision{seuil > 1 ? "s" : ""} avec blessés).
            {stats.hors > 0 && (
              <>
                {" "}
                {fmtInt(stats.hors)} collisions hors intersection ne sont pas
                sur la carte.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_28rem] lg:grid-rows-1">
        <div className="relative h-[60dvh] min-h-[360px] min-w-0 lg:h-full">
          <HotspotMap
            data={map.collection}
            mode={mode}
            selected={selected}
            onSelect={select}
            bounds={bounds}
          />

          <MapLegend mode={mode} min={map.min} max={map.max} />

          {map.count === 0 && (
            <p
              role="status"
              className="absolute inset-x-4 top-4 z-10 mx-auto w-fit max-w-md rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-card"
            >
              Aucune intersection n’atteint ce seuil avec ces filtres. Baissez
              le seuil ou changez les filtres.
            </p>
          )}
        </div>

        <aside
          aria-label="Fiche et classement"
          className="min-h-0 border-t border-line bg-white lg:overflow-y-auto lg:border-l lg:border-t-0"
        >
          <MapPanel
            selected={selected}
            tab={tab}
            onTab={(t) => setTabChoice({ sel: selected, tab: t })}
            stats={stats}
            ranking={ranking}
            onSelect={select}
          />
        </aside>
      </div>
    </div>
  );
}
