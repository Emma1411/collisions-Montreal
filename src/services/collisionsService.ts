import type { BinHeader, CollisionColumns } from '../interfaces/collision';

const MAGIC = 0x434f4c4c; 

export function decodeCollisions(raw: Uint8Array): CollisionColumns {
  if (raw.byteLength < 8) throw new Error(`Fichier COLL trop court (${raw.byteLength} octets)`);
  const buf = raw.buffer as ArrayBuffer;
  const dv = new DataView(buf, raw.byteOffset, raw.byteLength);
  if (dv.getUint32(0, false) !== MAGIC) throw new Error('Fichier COLL invalide (signature absente)');

  const hlen = dv.getUint32(4, true);
  const header: BinHeader = JSON.parse(new TextDecoder().decode(raw.subarray(8, 8 + hlen)));
  const base = raw.byteOffset + 8 + hlen;

  const column = (name: string) => {
    const c = header.columns.find(x => x.name === name);
    if (!c) throw new Error(`Colonne absente : ${name}`);
    if (8 + hlen + c.offset + c.bytes > raw.byteLength) throw new Error(`Colonne tronquée : ${name}`);
    return c;
  };
  const u8 = (name: string) => {
    const c = column(name);
    return new Uint8Array(buf, base + c.offset, c.bytes);
  };
  const u16 = (name: string) => {
    const c = column(name);
    const start = base + c.offset;
    return start % 2 === 0
      ? new Uint16Array(buf, start, c.bytes / 2)
      : new Uint16Array(buf.slice(start, start + c.bytes)); // copie si non aligné
  };

  return {
    n: header.n, annee0: header.annee0, flags: header.flags,
    inter: u16('inter'), annee: u8('annee'), mois: u8('mois'), jour: u8('jour'), heure: u8('heure'),
    gravite: u8('gravite'), flagsCol: u8('flags'), genre: u8('genre'), surface: u8('surface'),
    eclairage: u8('eclairage'), meteo: u8('meteo'), categorie: u8('categorie'), localisation: u8('localisation'),
  };
}

export async function fetchCollisions(url = '/data/collisions.bin.gz'): Promise<CollisionColumns> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} : HTTP ${res.status}`);
  if (res.headers.get('content-type')?.includes('text/html')) {
    throw new Error(`${url} : du HTML a été renvoyé à la place du fichier`);
  }
  let raw = new Uint8Array(await res.arrayBuffer());
  // si le serveur a déjà décompressé (Content-Encoding), la signature gzip est absente
  if (raw[0] === 0x1f && raw[1] === 0x8b) {
    const ds = new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'));
    raw = new Uint8Array(await new Response(ds).arrayBuffer());
  }
  if (raw.byteLength < 8) {
    throw new Error(`${url} : réponse de ${raw.byteLength} octets (content-type : ${res.headers.get('content-type')})`);
  }
  return decodeCollisions(raw);
}