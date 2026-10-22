import { useState } from 'react';
import { useMeta } from '../../hooks/useMeta';
import SeverityLegend from './SeverityLegend';

const KEY = 'collisions:guide-masque';
const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
const write = (v: boolean) => { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch { /* stockage indisponible */ } };

const STEPS = [
  ['Choisissez ce que vous voulez voir.', 'Les boutons en haut de la page filtrent par période, gravité, usagers et lieu. Sans choix, tout est affiché.'],
  ['Tout se met à jour.', 'Les chiffres et les graphiques changent ensemble. La phrase « Vous regardez… » résume vos choix et le nombre de collisions.'],
  ['Cliquez sur un type d’usager.', 'Piétons, cyclistes ou motos : la page ne garde alors que ces collisions. « Tout réinitialiser » remet tout à zéro.'],
];

export default function HowToRead() {
  const { annees } = useMeta();
  const [hidden, setHidden] = useState(read);
  const set = (v: boolean) => { setHidden(v); write(v); };

  if (hidden) {
    return (
      <button type="button" onClick={() => set(false)} className="text-sm font-medium text-brand underline-offset-2 hover:underline">
        Comment lire cette page ?
      </button>
    );
  }

  return (
    <section className="card space-y-5 p-5" aria-labelledby="titre-guide">
      <div>
        <h2 id="titre-guide" className="text-lg font-semibold tracking-tight text-ink">Comment lire cette page ?</h2>
        <p className="text-sm text-ink-muted">
          Ces chiffres décrivent les collisions routières survenues à Montréal de {annees[0]} à {annees[1]}.
        </p>
      </div>

      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map(([titre, texte], i) => (
          <li key={titre} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{i + 1}</span>
            <p className="text-sm text-ink-muted"><span className="font-semibold text-ink">{titre}</span> {texte}</p>
          </li>
        ))}
      </ol>

      <div className="space-y-2 border-t border-line pt-4">
        <p className="text-sm font-semibold text-ink">Les couleurs indiquent la gravité de la collision</p>
        <SeverityLegend withDefinitions />
        <p className="text-xs text-ink-faint">Les définitions précises sont dans la page Méthodologie.</p>
      </div>

      <button type="button" onClick={() => set(true)} className="text-sm font-medium text-brand underline-offset-2 hover:underline">
        Compris, masquer ce guide
      </button>
    </section>
  );
}