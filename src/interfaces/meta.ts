export interface RuptureAnnuelle { annee: number; sous_seuil: number; dm_seulement: number; leger: number; grave: number; mortel: number }

export interface Meta {
  genere_le: string;
  annees: [number, number];
  jours: string[];
  totaux: { retenues: number; blesses: number; graves: number; mortelles: number };
  stabilite: { persistants: number; recents: number; anciens: number; top50_en_commun: number };
  libelles: Record<'gravite' | 'surface' | 'eclairage' | 'meteo' | 'categorie' | 'localisation' | 'genre', Record<string, string>>;
  traits: string[];
  qualite: {
    lignes_lues: number; exclues_sous_seuil: number; retenues: number;
    heure_inconnue_toutes: number; heure_inconnue_retenues: number;
    positions_imprecises_pct: number; coordonnees_invalides: number;
    vitesse_vide_pct: number; hors_chemin_public: number;
    rupture_annuelle: RuptureAnnuelle[];
  };
  etendue: { lat: [number, number]; lon: [number, number] };
  source: { titre: string; fournisseur: string; licence: string; dictionnaire: string; avis: string };
}