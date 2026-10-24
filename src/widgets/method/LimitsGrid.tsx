import type { ReactNode } from 'react';
import { ETL } from '../../content/siteConfig';
import { useMeta } from '../../hooks/useMeta';
import { useMethodStats } from '../../hooks/useMethodStats';
import type { RuptureAnnuelle } from '../../interfaces/meta';
import { fmtInt, fmtPct, fmtVar } from '../../utils/format';
import { variation } from '../../utils/series';

interface Limite { id: string; chiffre: string; titre: string; texte: ReactNode; effet: string }
const blessesDe = (r: RuptureAnnuelle) => r.leger + r.grave + r.mortel;

export default function LimitsGrid() {
  const meta = useMeta();
  const st = useMethodStats();
  const q = meta.qualite;
  const retenues = meta.totaux.retenues;
  const limites: Limite[] = [];

  const r13 = q.rupture_annuelle.find(r => r.annee === 2013);
  const r14 = q.rupture_annuelle.find(r => r.annee === 2014);
  if (r13 && r14) {
    const vDm = variation(r13.dm_seulement, r14.dm_seulement);
    const vB = variation(blessesDe(r13), blessesDe(r14));
    if (vDm !== null && vB !== null) {
      limites.push({
        id: 'rupture', chiffre: '2014', titre: 'Une cassure dans la série en 2014',
        texte: <>Les collisions avec dégâts matériels seulement passent de {fmtInt(r13.dm_seulement)} (2013) à {fmtInt(r14.dm_seulement)} (2014), soit {fmtVar(vDm)}. Les collisions avec blessés restent stables ({fmtInt(blessesDe(r13))} → {fmtInt(blessesDe(r14))}, {fmtVar(vB)}). Les données n’expliquent pas cet écart.</>,
        effet: 'Ne comparez pas les dégâts matériels d’avant et d’après 2014.',
      });
    }
  }

  limites.push({
    id: 'heure', chiffre: fmtPct(q.heure_inconnue_retenues / retenues), titre: 'Heure inconnue',
    texte: <>{fmtInt(q.heure_inconnue_retenues)} collisions retenues n’ont pas d’heure. Elles comptent dans les totaux, mais pas dans la grille jour / heure.</>,
    effet: 'La grille horaire sous-estime légèrement le total.',
  });

  limites.push({
    id: 'position', chiffre: fmtPct(st.locImprecise / retenues), titre: 'Position approximative',
    texte: <>{fmtInt(st.locImprecise)} collisions ont une position marquée comme imprécise dans nos données.</>,
    effet: 'Sur la carte, ces collisions peuvent être rattachées à une intersection voisine.',
  });

  limites.push({
    id: 'hors-inter', chiffre: fmtPct(st.horsInter / retenues), titre: 'Collisions hors intersection',
    texte: <>{fmtInt(st.horsInter)} collisions ne sont rattachées à aucune intersection. Elles comptent dans tous les totaux, mais pas sur la carte.{ETL.rattachement && <> Une collision est rattachée à une intersection quand elle se situe {ETL.rattachement}.</>}</>,
    effet: st.horsInter / retenues > 0.5 ? 'Plus de la moitié des collisions n’est pas sur la carte.' : 'Une partie des collisions n’est pas sur la carte.',
  });

  limites.push({
    id: 'vitesse', chiffre: fmtPct(q.vitesse_vide_pct / 100), titre: 'Vitesse inconnue',
    texte: <>La vitesse affichée sur la route est vide dans {fmtPct(q.vitesse_vide_pct / 100)} des lignes analysées. Ce site ne l’utilise donc pas.</>,
    effet: 'Aucun résultat ne dépend de la vitesse.',
  });

  const np = ([
    ['le type de collision', st.nonPrecise.genre], ['l’état de la route', st.nonPrecise.surface],
    ['la luminosité', st.nonPrecise.eclairage], ['la météo', st.nonPrecise.meteo],
  ] as const).filter(([, n]) => n > 0);
  if (np.length > 0) {
    limites.push({
      id: 'non-precise', chiffre: fmtPct(Math.max(...np.map(([, n]) => n)) / retenues), titre: 'Informations non précisées',
      texte: <>Certaines collisions n’ont pas de valeur pour : {np.map(([l, n]) => `${l} (${fmtInt(n)})`).join(', ')}. Elles sont regroupées dans « Autre » dans les graphiques.</>,
      effet: 'Les parts affichées sont calculées sur toutes les collisions, renseignées ou non.',
    });
  }

  if (st.horsChemin > 0) {
    limites.push({
      id: 'hors-chemin', chiffre: fmtInt(st.horsChemin), titre: 'Stationnements et terrains privés',
      texte: <>{fmtInt(st.horsChemin)} collisions retenues ont eu lieu hors chemin public (stationnements, terrains privés…).</>,
      effet: 'Elles sont incluses dans tous les totaux.',
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {limites.map(l => (
        <article key={l.id} className="flex flex-col gap-2 rounded-xl border border-line p-4">
          <p className="num text-3xl text-brand">{l.chiffre}</p>
          <h3 className="text-sm font-semibold text-ink">{l.titre}</h3>
          <p className="text-sm text-ink-muted">{l.texte}</p>
          <p className="mt-auto border-t border-line pt-2 text-xs font-medium text-ink">{l.effet}</p>
        </article>
      ))}
    </div>
  );
}