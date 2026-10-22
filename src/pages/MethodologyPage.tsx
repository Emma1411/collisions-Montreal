export default function MethodologyPage() {
  return (
    <div className="page-container grid gap-10 py-8 lg:grid-cols-[14rem_1fr]">
      <aside className="hidden lg:block">
        <nav aria-label="Index du document" className="sticky top-[calc(var(--header-h)+1.5rem)]">
          {/* TocSidebar */}
        </nav>
      </aside>
      <article className="min-w-0 space-y-8">
        <h1 className="section-title">Comprendre les données</h1>
      </article>
    </div>
  );
}