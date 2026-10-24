import { useAppSelector } from '../../hooks/useAppSelector';
import { fmtDate } from '../../utils/format';

export default function Footer() {
  const meta = useAppSelector(s => s.dataset.meta);
  const src = meta?.source;

  return (
    <footer className="border-t border-line bg-white">
      <div className="page-container flex flex-col gap-3 py-6 text-xs leading-relaxed text-ink-muted lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <p className="max-w-3xl">
          {src
            ? <>Données : {src.fournisseur}, {src.titre} (licence {src.licence}). {src.avis}</>
            : 'Données : Ville de Montréal, Collisions routières (licence CC BY 4.0).'}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-x-8 gap-y-1">
          {meta && (
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              Données générées le {fmtDate(meta.genere_le)}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}