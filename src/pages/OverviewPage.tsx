import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FilterBar from "../components/ui/FilterBar";
import HowToRead from "../components/ui/HowToRead";
import { useMeta } from "../hooks/useMeta";
import AnnualTrendChart from "../widgets/overview/AnnualTrendChart";
import ConditionsBars from "../widgets/overview/ConditionsBars";
import KpiRow from "../widgets/overview/KpiRow";
import TemporalDistribution from "../widgets/overview/TemporalDistribution";
import TopConfigurations from "../widgets/overview/TopConfigurations";
import UserTypeCards from "../widgets/overview/UserTypeCards";

const ANCHOR = "scroll-mt-[calc(var(--header-h)+9rem)]";
const SECTIONS = [
  ["chiffres", "Les chiffres"],
  ["tendance", "Année par année"],
  ["horaires", "Quand ?"],
  ["usagers", "Qui est touché ?"],
  ["conditions", "Dans quelles conditions ?"],
];

export default function OverviewPage() {
  const { annees } = useMeta();
  return (
    <>
      <FilterBar />
      <div className="page-container space-y-12 py-8">
        <header className="space-y-3">
          <div>
            <p className="kicker">
              Bilan {annees[0]}–{annees[1]}
            </p>
            <h1 className="section-title mt-1">
              Collisions routières à Montréal
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Combien, quand, qui est touché et dans quelles conditions.
            </p>
          </div>
          <nav
            aria-label="Sections de la page"
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
          >
            <span className="kicker">Aller à :</span>
            {SECTIONS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="font-medium text-ink-muted hover:text-brand"
              >
                {label}
              </a>
            ))}
          </nav>
          <HowToRead />
        </header>

        <section
          id="chiffres"
          aria-labelledby="titre-chiffres"
          className={`${ANCHOR} space-y-4`}
        >
          <h2 id="titre-chiffres" className="section-title">
            Les chiffres
          </h2>
          <KpiRow />
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div id="tendance" className={`${ANCHOR} min-w-0 [&>section]:h-full`}>
            <AnnualTrendChart />
          </div>
          <div id="horaires" className={`${ANCHOR} min-w-0 [&>section]:h-full`}>
            <TemporalDistribution />
          </div>
        </div>
        
        <section
          id="usagers"
          aria-labelledby="titre-usagers"
          className={`${ANCHOR} space-y-6`}
        >
          <header>
            <p className="kicker">Piétons, cyclistes et motos</p>
            <h2 id="titre-usagers" className="section-title mt-1">
              Qui est touché ?
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-ink-muted">
              Ces trois cartes comparent les types d’usagers entre eux : elles
              suivent la période et le lieu, mais pas les filtres Gravité et
              Usagers. Cliquer sur une carte filtre toute la page.
            </p>
          </header>
          <UserTypeCards />
          <TopConfigurations />
        </section>

        <section
          id="conditions"
          aria-labelledby="titre-conditions"
          className={`${ANCHOR} space-y-6`}
        >
          <header>
            <p className="kicker">Route, lumière et météo</p>
            <h2 id="titre-conditions" className="section-title mt-1">
              Dans quelles conditions ?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Chaque barre représente 100 % des collisions affichées.
            </p>
          </header>
          <ConditionsBars />
        </section>

        <section
          className="rounded-xl bg-brand p-8 text-white sm:p-10"
          aria-labelledby="titre-cta-carte"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/70">
                Carte
              </p>
              <h2
                id="titre-cta-carte"
                className="text-2xl font-semibold tracking-tight"
              >
                Où ça arrive ? Explorez la carte des intersections
              </h2>
              <p className="text-sm text-white/80">
                Repérez les intersections où il y a eu le plus de collisions et
                comparez-les entre elles.
              </p>
            </div>
            <Link
              to="/carte"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
            >
              Ouvrir la carte <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
