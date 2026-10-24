export const ETL = {
  seuil: null as string | null,        // ex. « dommages matériels de moins de X $ »
  rattachement: null as string | null, // ex. « à moins de X m d’un point d’intersection »
  rang: null as string | null,         // ex. « le nombre de collisions avec blessés »
};

/** Lien de contact public (mailto:, LinkedIn, GitHub…). `null` masque la carte de contact. */
export const CONTACT_URL: string | null = null;