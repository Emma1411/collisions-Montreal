
export interface IntersectionsData {
  n: number;
  cle: string[];
  lat: number[];
  lon: number[];
  nom: string[];
  statut: number[];
  rang_p1: number[];
  rang_p2: number[];
  categorie: number[];
  profilee: number[];
}

export interface MetaData {
  genere_le: string;
  annees: number[];
  jours: string[];
  totaux: {
    retenues: number;
    blesses: number;
    graves: number;
    mortelles: number;
  };
  stabilite: {
    persistants: number;
    recents: number;
    anciens: number;
    top50_en_commun: number;
  };
  libelles: Record<string, Record<string, string>>;
  traits: string[];
  qualite: Record<string, unknown>;
  source: Record<string, string>;
}

export interface Similarite {
  i: number;
  s: number;
  t: string[];
}

export type SimilairesData = Record<string, Similarite[]>;

export interface CollisionColumns {
  inter: Uint16Array;
  annee: Uint8Array;
  mois: Uint8Array;
  jour: Uint8Array;
  heure: Uint8Array;
  gravite: Uint8Array;
  flags: Uint8Array;
  genre: Uint8Array;
  surface: Uint8Array;
  eclairage: Uint8Array;
  meteo: Uint8Array;
  categorie: Uint8Array;
  localisation: Uint8Array;
}

interface BinaryHeader {
  n: number;
  annee0: number;
  flags: Record<string, number>;
  columns: {
    name: keyof CollisionColumns;
    dtype: string;
    offset: number;
    bytes: number;
  }[];
}

export interface CollisionData {
  header: BinaryHeader;
  columns: CollisionColumns;
}

export interface SiteData {
  intersections: IntersectionsData;
  meta: MetaData;
  similaires: SimilairesData;
  collisions: CollisionData;
}

async function chargerJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Impossible de charger ${url}: HTTP ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

async function decomprimerGzip(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const bytes = new Uint8Array(buffer);

  // Le navigateur ou le serveur a déjà décompressé le fichier.
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
    return buffer;
  }

  if (typeof DecompressionStream === "undefined") {
    throw new Error(
      "La décompression gzip n'est pas prise en charge par ce navigateur.",
    );
  }

  const stream = new Blob([buffer])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));

  return new Response(stream).arrayBuffer();
}

async function chargerBinaire(): Promise<CollisionData> {
  const response = await fetch("/data/collisions.bin.gz");

  if (!response.ok) {
    throw new Error(
      `Impossible de charger collisions.bin.gz : HTTP ${response.status}`,
    );
  }

  const buffer = await response.arrayBuffer();
  const raw = await decomprimerGzip(buffer);

  if (raw.byteLength < 8) {
    throw new Error("Fichier binaire trop court.");
  }

  const view = new DataView(raw);

  // Signature ASCII : COLL
  if (
    view.getUint8(0) !== 0x43 ||
    view.getUint8(1) !== 0x4f ||
    view.getUint8(2) !== 0x4c ||
    view.getUint8(3) !== 0x4c
  ) {
    throw new Error("Signature du fichier binaire invalide.");
  }

  const headerLength = view.getUint32(4, true);

  if (8 + headerLength > raw.byteLength) {
    throw new Error("En-tête binaire incomplet.");
  }

  const headerText = new TextDecoder().decode(
    new Uint8Array(raw, 8, headerLength),
  );

  const header = JSON.parse(headerText) as BinaryHeader;
  const base = 8 + headerLength;

  if (!Number.isInteger(header.n) || header.n < 0) {
    throw new Error("Nombre de collisions invalide.");
  }

  const columns: CollisionColumns = {
    inter: new Uint16Array(header.n),
    annee: new Uint8Array(header.n),
    mois: new Uint8Array(header.n),
    jour: new Uint8Array(header.n),
    heure: new Uint8Array(header.n),
    gravite: new Uint8Array(header.n),
    flags: new Uint8Array(header.n),
    genre: new Uint8Array(header.n),
    surface: new Uint8Array(header.n),
    eclairage: new Uint8Array(header.n),
    meteo: new Uint8Array(header.n),
    categorie: new Uint8Array(header.n),
    localisation: new Uint8Array(header.n),
  };

  const colonnesLues = new Set<keyof CollisionColumns>();

  for (const column of header.columns) {
    const offset = base + column.offset;
    const tailleElement =
      column.dtype === "uint16" ? 2 :
      column.dtype === "uint8" ? 1 : 0;

    if (tailleElement === 0) {
      throw new Error(
        `Type binaire inconnu : ${column.dtype}`,
      );
    }

    if (column.bytes !== header.n * tailleElement) {
      throw new Error(
        `Taille incorrecte pour la colonne ${column.name}.`,
      );
    }

    if (
      !Number.isInteger(column.offset) ||
      column.offset < 0 ||
      offset + column.bytes > raw.byteLength
    ) {
      throw new Error(
        `Offset invalide pour la colonne ${column.name}.`,
      );
    }

    if (colonnesLues.has(column.name)) {
      throw new Error(
        `Colonne dupliquée : ${column.name}`,
      );
    }

    colonnesLues.add(column.name);

    if (column.dtype === "uint16") {
      if (column.name !== "inter") {
        throw new Error(
          `Type uint16 inattendu pour ${column.name}.`,
        );
      }

      for (let i = 0; i < header.n; i++) {
        columns.inter[i] = view.getUint16(
          offset + i * 2,
          true,
        );
      }
    } else {
      const target = columns[column.name];

      if (!(target instanceof Uint8Array)) {
        throw new Error(
          `Type uint8 inattendu pour ${column.name}.`,
        );
      }

      target.set(
        new Uint8Array(raw, offset, header.n),
      );
    }
  }

  if (colonnesLues.size !== Object.keys(columns).length) {
    throw new Error(
      "Certaines colonnes attendues sont absentes du fichier binaire.",
    );
  }

  return { header, columns };
}

export async function chargerDonnees(): Promise<SiteData> {
  const [
    intersections,
    meta,
    similaires,
    collisions,
  ] = await Promise.all([
    chargerJson<IntersectionsData>(
      "/data/intersections.json",
    ),
    chargerJson<MetaData>(
      "/data/meta.json",
    ),
    chargerJson<SimilairesData>(
      "/data/similaires.json",
    ),
    chargerBinaire(),
  ]);

  if (collisions.header.n !== collisions.columns.gravite.length) {
    throw new Error(
      "Le nombre de collisions ne correspond pas à l'en-tête binaire.",
    );
  }

  if (intersections.n !== intersections.cle.length) {
    throw new Error(
      "Le nombre d'intersections ne correspond pas aux clés.",
    );
  }

  return {
    intersections,
    meta,
    similaires,
    collisions,
  };
}
