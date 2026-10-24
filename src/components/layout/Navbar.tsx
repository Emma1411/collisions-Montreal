import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Compass, Download, Menu, X } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { SOURCE_URL } from '../../utils/constants';

const LINKS = [
  { to: '/', label: 'Vue d’ensemble', end: true },
  { to: '/carte', label: 'Carte des points chauds', end: false },
  { to: '/methodologie', label: 'Méthodologie & Limites', end: false },
] as const;

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  [
    'relative flex h-full items-center px-3 text-sm font-medium transition-colors',
    'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full',
    isActive ? 'text-brand after:bg-brand' : 'text-ink-muted after:bg-transparent hover:text-ink',
  ].join(' ');

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const annees = useAppSelector(s => s.dataset.meta?.annees);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="page-container flex h-(--header-h) items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Collisions Montréal, accueil">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand">
            <Compass className="size-5" aria-hidden />
          </span>
          <span className="text-[15px] font-semibold leading-tight text-ink">
            Collisions<br />Montréal
          </span>
        </Link>

        {annees && (
          <span className="hidden rounded bg-brand-soft px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-brand 2xl:inline-flex">
            Données {annees[0]}–{annees[1]} · Ville de Montréal
          </span>
        )}

        <nav className="hidden h-full lg:ml-auto lg:flex" aria-label="Navigation principale">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Download className="size-4" aria-hidden />
            <span className="hidden xl:inline">Télécharger les données ouvertes</span>
            <span className="sr-only xl:hidden">Télécharger les données ouvertes</span>
          </a>
         
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md text-ink-muted hover:bg-canvas lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-line bg-white lg:hidden" aria-label="Navigation principale">
          <ul className="page-container flex flex-col py-2">
            {LINKS.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-3 text-sm font-medium ${isActive ? 'bg-brand-soft text-brand' : 'text-ink-muted'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}