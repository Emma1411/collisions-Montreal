import { ExternalLink } from 'lucide-react';
import Accordion from '../components/ui/Accordion';
import Callout from '../components/ui/Callout';
import SeverityLegend from '../components/ui/SeverityLegend';
import { CONTACT_URL, ETL } from '../content/siteConfig';
import { useActiveSection } from '../hooks/useActiveSection';
import { useMeta } from '../hooks/useMeta';
import { useMethodStats } from '../hooks/useMethodStats';
import { P1_FIN, SOURCE_URL } from '../utils/constants';
import { dataset } from '../utils/datasetStore';
import { fmtDate, fmtInt, fmtPct } from '../utils/format';
import LimitsGrid from '../widgets/method/LimitsGrid';
import RulesGrid from '../widgets/method/RulesGrid';
import Section from '../widgets/method/Section';
import SlopeChart from '../widgets/method/SlopeChart';
import TocSidebar from '../widgets/method/TocSidebar';

const SECTIONS = [
  { id: 'pourquoi', n: '01', label: 'Pourquoi ce site ?' },
  { id: 'sources', n: '02', label: 'D’où viennent les données ?' },
  { id: 'regles', n: '03', label: 'Trois règles de lecture' },
  { id: 'definitions', n: '04', label: 'Définitions' },
  { id: 'limites', n: '05', label: 'Limites à connaître' },
  { id: 'dynamique', n: '06', label: 'Les points chauds bougent' },
  { id: 'faq', n: '07', label: 'Questions fréquentes' },
] as const;
const IDS = SECTIONS.map(s => s.id);

const card = 'rounded-xl border border-line bg-canvas/50 p-4';

export default function MethodologyPage() {
  const meta = useMeta();
  const st = useMethodStats();
  const active = useActiveSection(IDS);
  const [a0, a1] = meta.annees;
  const q = meta.qualite;
  const src = meta.source;
  const l1 = `${a0}–${P1_FIN}`, l2 = `${P1_FIN + 1}–${a1}`;
  const retenues = meta.totaux.retenues;
  const nSimilaires = Object.keys(dataset.similaires ?? {}).length;
  const horsPct = fmtPct(st.horsInter / retenues);

  const definitions = [
    {
      id: 'retenues', q: 'Collisions lues, retenues et exclues',
      a: (
        <>
          <p>Le fichier source contient {fmtInt(q.lignes_lues)} lignes. {fmtInt(q.retenues)} sont retenues pour l’analyse ({fmtPct(q.retenues / q.lignes_lues)}) et {fmtInt(q.exclues_sous_seuil)} sont écartées avant l’analyse ({fmtPct(q.exclues_sous_seuil / q.lignes_lues)}) parce qu’elles sont « sous le seuil » de l’étude.</p>
          {ETL.seuil && <p>Règle appliquée : {ETL.seuil}.</p>}
          <p>Tous les chiffres du site portent sur les {fmtInt(q.retenues)} collisions retenues.</p>
        </>
      ),
    },
    {
      id: 'gravite', q: 'Les niveaux de gravité',
      a: (
        <>
          <p>Chaque collision porte un seul niveau de gravité dans le jeu de données. Les couleurs du site suivent ces niveaux :</p>
          <SeverityLegend withDefinitions />
          <p>« Avec blessés » regroupe les collisions légères, graves et mortelles.</p>
        </>
      ),
    },
    {
      id: 'intersection', q: 'Intersection et collision « hors intersection »',
      a: (
        <>
          <p>Une collision est rattachée à une intersection si elle se trouve assez près d’un point d’intersection connu.{ETL.rattachement && <> Règle appliquée : {ETL.rattachement}.</>}</p>
          <p>{fmtInt(st.horsInter)} collisions ({horsPct}) ne sont rattachées à aucune intersection. Elles comptent dans les totaux, mais n’apparaissent pas sur la carte.</p>
        </>
      ),
    },
    {
      id: 'point-chaud', q: 'Point chaud : persistant, nouveau, ancien',
      a: (
        <>
          <p>Un point chaud est une intersection classée parmi les 100 premières d’une période. Deux périodes sont comparées : {l1} et {l2}.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong className="text-ink">Persistant</strong> ({meta.stabilite.persistants}) : dans le top 100 aux deux périodes.</li>
            <li><strong className="text-ink">Nouveau</strong> ({meta.stabilite.recents}) : dans le top 100 en {l2} seulement.</li>
            <li><strong className="text-ink">Ancien</strong> ({meta.stabilite.anciens}) : dans le top 100 en {l1} seulement.</li>
          </ul>
          {ETL.rang && <p>Le classement est établi selon {ETL.rang}.</p>}
        </>
      ),
    },
    {
      id: 'ressemblance', q: 'Intersections qui se ressemblent',
      a: (
        <>
          <p>Pour {fmtInt(nSimilaires)} intersections, le site propose les 5 dont le profil de collisions est le plus proche. La comparaison porte sur {meta.traits.length} caractéristiques : {meta.traits.join(', ')}.</p>
          <p>Le pourcentage de ressemblance va de 0 % à 100 %. Il compare des profils passés ; ce n’est pas une prédiction, et ces intersections ne sont pas forcément voisines.</p>
        </>
      ),
    },
  ];

  const faq = [
    {
      id: 'pourquoi-2021', q: 'Pourquoi le bilan s’arrête-t-il à 2021 ?',
      a: (
        <>
          <p>Le jeu de données de la Ville couvre {a0}–{a1}. Pour les collisions suivantes, la Ville renvoie vers les données de la SAAQ. Depuis la révision de la SAAQ en décembre 2023, le contenu des deux plateformes diffère pour 2012-2021.</p>
          <p>Ce site n’utilise que le jeu de données de la Ville et ne mélange pas les deux sources.</p>
        </>
      ),
    },
    {
      id: 'reutiliser', q: 'Puis-je réutiliser les chiffres et les cartes ?',
      a: (
        <>
          <p>Les données sources sont sous licence {src.licence} : vous pouvez les réutiliser en citant la source ({src.fournisseur}). Pour citer ce site, indiquez son adresse et la date de consultation.</p>
          <p><a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">Voir le jeu de données <ExternalLink className="size-3.5" aria-hidden /></a></p>
        </>
      ),
    },
    {
      id: 'amenagement', q: 'Peut-on voir l’effet d’un aménagement (piste cyclable, feux…) ?',
      a: <p>Non. Le jeu de données ne contient aucun aménagement. On peut voir qu’une intersection a changé de niveau entre deux périodes, mais pas pourquoi, ni si un aménagement y a contribué.</p>,
    },
    {
      id: 'carte', q: 'Pourquoi tant de collisions ne sont-elles pas sur la carte ?',
      a: <p>Une collision n’apparaît sur la carte que si elle est rattachée à une intersection. {fmtInt(st.horsInter)} collisions ({horsPct}) ne le sont pas : elles comptent dans tous les chiffres des autres pages, mais pas sur la carte.</p>,
    },
    {
      id: 'auteur', q: 'Qui est derrière ce site ?',
      a: <p>Un projet indépendant, qui n’est affilié ni à la Ville de Montréal ni à la SAAQ. Il décrit des données publiques et ne recommande aucun aménagement.</p>,
    },
  ];

  return (
    <div className="page-container grid gap-8 py-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] space-y-4">
          <TocSidebar sections={SECTIONS} active={active} />
          <div className="rounded-lg bg-canvas p-3 text-xs text-ink-muted">
            <p className="font-medium text-ink">Version des données</p>
            <p>Générées le {fmtDate(meta.genere_le)}</p>
          </div>
        </div>
      </aside>

      <article className="min-w-0 space-y-6">
        <header className="space-y-3">
          <p className="kicker">Observatoire indépendant · Montréal {a0}–{a1}</p>
          <h1 className="section-title">Comprendre les données</h1>
          <p className="max-w-3xl text-sm text-ink-muted">
            Cette page explique d’où viennent les chiffres, comment les lire sans se tromper et ce qu’ils ne disent pas.
          </p>
          <details className="card p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-ink">Sommaire</summary>
            <div className="mt-2"><TocSidebar sections={SECTIONS} active={active} /></div>
          </details>
        </header>

        <Section id="pourquoi" n="01" title="Pourquoi ce site ?" tag="Mission">
          <p className="max-w-3xl text-sm text-ink-muted">
            Le débat sur la sécurité routière s’appuie souvent sur des histoires isolées. Ce site propose de regarder l’ensemble des
            collisions rapportées à Montréal, par année, heure, type d’usager et intersection, pour que chacun puisse se faire sa propre idée.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className={card}><h3 className="text-sm font-semibold text-ink">Transparence</h3><p className="mt-1 text-sm text-ink-muted">Tous les chiffres sont calculés à partir du jeu de données public. Aucun n’est écrit à la main.</p></div>
            <div className={card}><h3 className="text-sm font-semibold text-ink">Rien d’inventé</h3><p className="mt-1 text-sm text-ink-muted">Aucune collision n’est ajoutée ni estimée. Quand une information manque, le site le dit.</p></div>
            <div className={card}><h3 className="text-sm font-semibold text-ink">Neutralité</h3><p className="mt-1 text-sm text-ink-muted">Le site décrit des données. Il ne recommande aucun aménagement ni aucune limite de vitesse.</p></div>
          </div>
        </Section>

        <Section id="sources" n="02" title="D’où viennent les données ?" tag="Sources">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={card}>
              <h3 className="text-sm font-semibold text-ink">Le jeu de données</h3>
              <p className="mt-1 text-sm text-ink-muted">« {src.titre} », publié par la Ville de Montréal sur Données Québec. Licence {src.licence}.</p>
              <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">Ouvrir la fiche <ExternalLink className="size-3.5" aria-hidden /></a>
            </div>
            <div className={card}>
              <h3 className="text-sm font-semibold text-ink">Qui récolte les données ?</h3>
              <p className="mt-1 text-sm text-ink-muted">Les collisions sont consignées par le Service de police de la Ville de Montréal (SPVM) dans des rapports d’accident. Les codes (gravité, météo, type de collision…) suivent le dictionnaire de la SAAQ.</p>
            </div>
            <div className={card}>
              <h3 className="text-sm font-semibold text-ink">Période et volume</h3>
              <p className="mt-1 text-sm text-ink-muted">{a0}–{a1} : {fmtInt(q.lignes_lues)} lignes lues, {fmtInt(q.retenues)} retenues, {fmtInt(q.exclues_sous_seuil)} exclues (voir « Définitions »).</p>
            </div>
            <div className={card}>
              <h3 className="text-sm font-semibold text-ink">Version du site</h3>
              <p className="mt-1 text-sm text-ink-muted">Données traitées le {fmtDate(meta.genere_le)}. {src.avis}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={card}>
              <h3 className="text-sm font-semibold text-ink">Ce que le jeu de données couvre</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                <li>Les collisions rapportées par le SPVM sur le territoire de Montréal</li>
                <li>Les collisions avec dégâts matériels de moins de 2 000 $ comptées par le SPVM</li>
                <li>Un niveau de gravité par collision : décès, blessure grave, blessure légère, dégâts matériels seulement</li>
              </ul>
            </div>
            <div className={card}>
              <h3 className="text-sm font-semibold text-ink">Ce qu’il ne couvre pas</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                <li>Les autoroutes</li>
                <li>Les collisions sans rapport de police, ou sans véhicule motorisé</li>
                <li>Les années après 2021 (voir la SAAQ)</li>
              </ul>
            </div>
          </div>
          <Callout title="Ce site compte des collisions, pas des personnes">
            Une collision avec trois blessés compte pour une seule collision. Les pourcentages parlent donc de collisions, jamais de victimes.
          </Callout>
        </Section>

        <Section id="regles" n="03" title="Trois règles pour bien lire les chiffres" tag="Précautions">
          <RulesGrid />
        </Section>

        <Section id="definitions" n="04" title="Définitions" tag="Vocabulaire">
          <Accordion items={definitions} />
        </Section>

        <Section id="limites" n="05" title="Les limites à connaître" tag="Biais et tolérances">
          <p className="max-w-3xl text-sm text-ink-muted">Aucune donnée n’est parfaite. Voici ce que celles-ci ne disent pas bien, avec les chiffres exacts.</p>
          <LimitsGrid />
        </Section>

        <Section id="dynamique" n="06" title="Les points chauds bougent" tag="Évolution">
          <SlopeChart />
        </Section>

        <Section id="faq" n="07" title="Questions fréquentes" tag="FAQ">
          <Accordion items={faq} />
          {CONTACT_URL && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/20 bg-brand-soft/50 p-4">
              <p className="text-sm text-ink">Une erreur, une question, une anomalie dans les données ? Écrivez-nous.</p>
              <a href={CONTACT_URL} className="btn-primary">Nous contacter</a>
            </div>
          )}
        </Section>
      </article>
    </div>
  );
}