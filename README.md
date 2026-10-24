# collisions-front — Interface Utilisateur

## Description

Application web React pour explorer les **collisions routières rapportées à Montréal entre 2012 et 2021** : combien, quand, qui est touché, dans quelles conditions et à quelles intersections. Tout est calculé dans le navigateur à partir de fichiers statiques : **aucun serveur d'API**. L'interface est pensée pour être comprise sans connaissance préalable : une phrase « Vous regardez… » résume les filtres, chaque couleur a sa légende, et chaque chiffre vient des données.

Projet indépendant, non affilié à la Ville de Montréal ni à la SAAQ.

🔗 **Lien de démonstration** : https://collisions-montreal.vercel.app/

## Fonctionnalités

- **Vue d'ensemble** : 4 chiffres clés animés, évolution annuelle par niveau de gravité, grille jour × heure, saisonnalité mensuelle, comparaison piétons / cyclistes / motos, types de collision et conditions (route, luminosité, météo)
- **Carte des points chauds** : intersections en points ou en zones chaudes, recherche par nom, fiche détaillée (avant / après, usagers impliqués, conditions), intersections au profil similaire, top 20, lien partageable
- **Méthodologie & Limites** : sources, règles de lecture, définitions, limites chiffrées sur les données réelles, évolution du classement entre 2012-2016 et 2017-2021, FAQ
- **Filtres partagés** : période, gravité, usagers impliqués, lieu. Ils s'appliquent à toute la page, se synchronisent avec l'URL et survivent au rechargement
- **Lisible par tous** : guide « Comment lire cette page ? », définitions des niveaux de gravité, avertissement quand un graphique compte des collisions et non un risque
- **Interface responsive** : mobile, tablette, desktop
- **Accessibilité** : navigation clavier, rôles ARIA, alternatives textuelles, respect de `prefers-reduced-motion`

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Framework | React |
| Langage | TypeScript |
| État | Redux Toolkit (méta-données et filtres) |
| Routage | React Router (pages chargées à la demande) |
| Styling | Tailwind CSS v4 |
| Graphiques | Recharts, SVG et CSS grid sur mesure |
| Carte | MapLibre GL JS 6 + fond OpenFreeMap (sans clé API) |
| Données | Fichiers statiques gzip décodés en colonnes typées (aucun backend) |
| Tests | Vitest |
| Build | Vite |
| Déploiement | Vercel (gratuit) |

## Architecture Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│                       React Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │    Pages     │    │   Widgets    │    │    Hooks     │      │
│   │  (3 pages)   │    │ overview/map │    │ (sélecteurs) │      │
│   └──────────────┘    └──────────────┘    └──────────────┘      │
│          │                   │                   │              │
│          └───────────────────┴───────────────────┘              │
│                              │                                  │
│                     ┌────────▼────────┐                         │
│                     │   Redux Store   │                         │
│                     │ dataset, filters│  ◄── synchronisé        │
│                     └────────┬────────┘      avec l'URL         │
│                              │ sélecteurs mémoïsés              │
│                     ┌────────▼────────┐                         │
│                     │  utils/aggregate│                         │
│                     │ 1 passage par   │                         │
│                     │ combinaison     │                         │
│                     └────────┬────────┘                         │
│                              │ lit                              │
│                     ┌────────▼────────┐                         │
│                     │  datasetStore   │                         │
│                     │ colonnes typées │                         │
│                     └────────┬────────┘                         │
│                              │ fetch au démarrage               │
└──────────────────────────────┼──────────────────────────────────┘
                               ▼
              ┌──────────────────────────────┐      ┌──────────────┐
              │        public/data/*         │      │ OpenFreeMap  │
              │     (fichiers statiques)     │      │ (fond carte) │
              └──────────────────────────────┘      └──────────────┘
```

Les 131 200 collisions restent hors du store Redux (non sérialisables) : elles vivent dans un module singleton en tableaux typés. Redux ne garde que l'état de chargement, les méta-données et les filtres. Chaque combinaison de filtres déclenche **un seul** passage sur les données, partagé par tous les widgets.

## Données

Les fichiers de `public/data/` sont produits par un pipeline de préparation, **hors de ce dépôt** :

| Fichier | Contenu |
|---------|---------|
| `collisions.bin.gz` | Les collisions retenues, en colonnes |
| `intersections.json` | Intersections (colonnes) : coordonnées, nom, classement par période |
| `similaires.json` | Pour chaque intersection, les 5 au profil le plus proche |
| `meta.json` | Totaux, libellés des codes, indicateurs de qualité, source et licence |

## Structure du projet

```
collisions-front/
├─ public/
│  ├─ favicon.svg
│  └─ data/                    # fichiers de données 
├─ src/
│  ├─ main.tsx · App.tsx · index.css
│  ├─ store.ts · rootReducers.ts
│  ├─ content/                 # textes à renseigner (contact, règles de l'ETL)
│  ├─ interfaces/              # types : collisions, filtres, intersections, méta, carte
│  ├─ services/                # chargement et décodage des fichiers
│  ├─ thunks/                  # loadDataset
│  ├─ slices/                  # dataset, filters
│  ├─ hooks/                   # sélecteurs mémoïsés, URL des filtres, animations
│  ├─ utils/                   # agrégations, groupes de codes, formats, couleurs
│  ├─ routes/ · layouts/       # routeur, navbar, pied de page
│  ├─ pages/                   # Vue d'ensemble, Carte, Méthodologie
│  ├─ components/
│  │  ├─ layout/               # Navbar, Footer, DatasetGate
│  │  └─ ui/                   # filtres, cartes de chiffres, légendes, accordéon
│  └─ widgets/
│     ├─ overview/             # tendance, grille horaire, usagers, conditions…
│     ├─ map/                  # carte, recherche, fiche, top 20, légende
│     └─ method/               # règles, limites, classement, index
├─ vercel.json
└─ vite.config.ts
```

## Choix de conception

- **La couleur désigne uniquement la gravité** (rouge : mortelle, orange : grave, bleu : légère, gris : dégâts matériels). Les types d'usagers se reconnaissent par une icône, jamais par une couleur
- **Tout suit les filtres, sans exception cachée.** Les deux seuls widgets qui font exception (la tendance, qui a ses propres boutons de gravité, et les cartes d'usagers, qui se comparent entre elles) le disent à l'écran
- **Des collisions, pas des victimes** : les données n'ont qu'un niveau de gravité par collision. Les libellés et les pourcentages parlent de collisions
- **Volume ≠ risque** : le site ne calcule aucun risque, faute de données sur l'exposition (nombre de passages)
- **Chiffres jamais écrits à la main** : les limites de la page Méthodologie sont calculées à partir des données

## Source des données

Ville de Montréal, jeu de données « Collisions routières », publié sur [Données Québec](https://www.donneesquebec.ca/recherche/dataset/vmtl-collisions-routieres), licence CC BY 4.0. Les codes suivent le dictionnaire de la SAAQ.

Ce projet est indépendant : il n'est affilié ni à la Ville de Montréal ni à la SAAQ.
