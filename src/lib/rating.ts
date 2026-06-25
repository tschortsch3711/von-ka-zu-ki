// Zentrale Ableitung der Sterne-Darstellung aus dem quality-Score (0–1) der Analogien.
// Eine einzige Quelle für Schwellwerte, Top-2-Auswahl (Karten) und Top-N (Domänen-Detail).
import type { GlossaryTerm } from '../data/types';

/** Schwellwerte: ab welchem Score sich der Sternfaktor erhöht. Reine Anzeige-Konfiguration. */
export const STAR_THRESHOLDS = { three: 0.75, two: 0.5, one: 0.25 } as const;

/** Score -> Anzahl gefüllter Sterne (0 = nicht tragfähig). */
export function scoreToStars(score: number): 0 | 1 | 2 | 3 {
  if (score >= STAR_THRESHOLDS.three) return 3;
  if (score >= STAR_THRESHOLDS.two) return 2;
  if (score >= STAR_THRESHOLDS.one) return 1;
  return 0;
}

const STAR_LABELS = ['kaum tragfähig', 'okay erklärbar', 'gut erklärbar', 'sehr gut erklärbar'] as const;

/** Klartext-Bewertung für sr-only / title. */
export function starLabel(score: number): string {
  return STAR_LABELS[scoreToStars(score)];
}

/**
 * Sterne als Zeichenkette. Bei 0 Sternen ein feiner Punkt „·"
 * (Analogie vorhanden, aber für Anwender nicht tragfähig).
 */
export function starGlyphs(score: number): string {
  const n = scoreToStars(score);
  if (n === 0) return '·';
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

interface ScoredKey { key: string; quality: number; }

function scoredKeys(term: GlossaryTerm): ScoredKey[] {
  return Object.entries(term.domainAnalogies)
    .map(([key, a]) => ({ key, quality: a.quality ?? 0 }))
    .sort((a, b) => b.quality - a.quality);
}

/** Domänen-Schlüssel eines Begriffs, absteigend nach Score, auf die n stärksten begrenzt. */
export function topDomainKeys(term: GlossaryTerm, n = 2): string[] {
  return scoredKeys(term).slice(0, n).map((s) => s.key);
}

/** Der höchstbewertete Domänen-Schlüssel eines Begriffs (stärkste Perspektive). */
export function bestDomainKey(term: GlossaryTerm): string | null {
  return scoredKeys(term)[0]?.key ?? null;
}

/** Die n Begriffe mit dem höchsten quality-Score für eine Domäne (Top-N je Perspektive). */
export function bestTermsForDomain(terms: GlossaryTerm[], domainKey: string, n = 6): GlossaryTerm[] {
  return terms
    .filter((t) => t.domainAnalogies[domainKey] != null)
    .map((t) => ({ t, q: t.domainAnalogies[domainKey].quality ?? 0 }))
    .sort((a, b) => b.q - a.q)
    .slice(0, n)
    .map((x) => x.t);
}
