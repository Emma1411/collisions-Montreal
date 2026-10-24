import type { InterStats, Ranking } from '../../utils/byIntersection';
import { dataset } from '../../utils/datasetStore';
import IntersectionSheet from './IntersectionSheet';
import SimilarIntersections from './SimilarIntersections';
import Top20 from './Top20';

export type PanelTab = 'fiche' | 'top';
interface Props {
  selected: number | null; tab: PanelTab; onTab: (t: PanelTab) => void;
  stats: InterStats; ranking: Ranking; onSelect: (i: number | null) => void;
}

const tabCls = (on: boolean) =>
  `flex-1 truncate rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${on ? 'bg-brand-soft text-brand' : 'text-ink-muted hover:text-ink'}`;

export default function MapPanel({ selected, tab, onTab, stats, ranking, onSelect }: Props) {
  const active: PanelTab = selected === null ? 'top' : tab;
  return (
    <div>
      <div role="tablist" aria-label="Panneau d’information" className="z-10 flex gap-1 border-b border-line bg-white p-2 lg:sticky lg:top-0">
        <button role="tab" type="button" aria-selected={active === 'fiche'} disabled={selected === null} onClick={() => onTab('fiche')} className={tabCls(active === 'fiche')}>
          {selected === null ? 'Fiche' : `Fiche : ${dataset.intersections!.nom[selected]}`}
        </button>
        <button role="tab" type="button" aria-selected={active === 'top'} onClick={() => onTab('top')} className={tabCls(active === 'top')}>Top 20</button>
      </div>
      <div role="tabpanel" className="p-4">
        {active === 'fiche' && selected !== null ? (
          <>
            <IntersectionSheet idx={selected} stats={stats} ranking={ranking} onClose={() => onSelect(null)} />
            <SimilarIntersections idx={selected} onSelect={onSelect} />
          </>
        ) : (
          <>
            {selected === null && (
              <p className="mb-4 rounded-lg bg-canvas px-3 py-2 text-xs text-ink-muted">
                Cliquez sur un point de la carte, cherchez une intersection ou choisissez une ligne ci-dessous pour voir sa fiche.
              </p>
            )}
            <Top20 stats={stats} ranking={ranking} selected={selected} onSelect={onSelect} />
          </>
        )}
      </div>
    </div>
  );
}