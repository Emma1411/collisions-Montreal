export default function HotspotsPage() {
  return (
    <div className="flex h-[calc(100dvh-var(--header-h))] min-h-140 flex-col">
      <div className="border-b border-line bg-white">
        <div className="page-container py-2 text-xs text-ink-muted">Barre d’outils de la carte</div>
      </div>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_28rem]">
        <section aria-label="Carte" className="bg-brand-soft/40" />
        <aside aria-label="Fiche de l’intersection" className="overflow-y-auto border-l border-line bg-white" />
      </div>
    </div>
  );
}