const nf = new Intl.NumberFormat('fr-CA');
const pf = new Intl.NumberFormat('fr-CA', { style: 'percent', maximumFractionDigits: 1 });
const d1 = new Intl.NumberFormat('fr-CA', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtDec1 = (n: number) => d1.format(n);

export const fmtVar = (ratio: number) =>
  `${ratio > 0 ? '+' : ratio < 0 ? '−' : ''}${d1.format(Math.abs(ratio) * 100)}\u00a0%`;
export const fmtInt = (n: number) => nf.format(n);          // 131 200
export const fmtPct = (ratio: number) => pf.format(ratio);  // 36,6 %
// timeZone UTC : "2026-10-21" ne doit pas devenir le 20 à Montréal
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-CA', { dateStyle: 'long', timeZone: 'UTC' });