// npm run validate — prüft Vollständigkeit und Konsistenz von glossary.json, domains.json und paths.json.
// Die Typen werden aus src/data/types.ts importiert (eine Quelle der Wahrheit, keine Schema-Drift).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import type { GlossaryTerm, Domain, LearningPath } from '../src/data/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const glossary: GlossaryTerm[] = JSON.parse(readFileSync(join(root, 'src/data/glossary.json'), 'utf-8'));
const domains: Domain[] = JSON.parse(readFileSync(join(root, 'src/data/domains.json'), 'utf-8'));
const paths: LearningPath[] = JSON.parse(readFileSync(join(root, 'src/data/paths.json'), 'utf-8'));

let errors = 0;
const fail = (msg: string) => { console.error(`  ✗ ${msg}`); errors++; };

// Fängt im Gegensatz zur reinen Skalar-Prüfung auch leere Arrays ([]) ab.
const isEmpty = (v: unknown): boolean =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

const domainKeys = domains.map((d) => d.key);
const termIds = new Set(glossary.map((t) => t.id));
const termSlugs = new Set(glossary.map((t) => t.slug));
const knownRef = (ref: string) => termIds.has(ref) || termSlugs.has(ref);

// ---------- Begriffe ----------
const requiredTermFields: (keyof GlossaryTerm)[] = [
  'id', 'slug', 'term', 'aliases', 'category', 'difficulty', 'enterpriseRelevance',
  'shortDefinition', 'technicalDefinition', 'whyItMatters',
  'misconceptions', 'domainAnalogies', 'relatedTerms', 'tags',
];

for (const term of glossary) {
  const ctx = `[${term.id ?? '???'}]`;

  for (const field of requiredTermFields) {
    if (isEmpty(term[field])) fail(`${ctx} Pflichtfeld fehlt oder leer: ${field}`);
  }

  for (const key of domainKeys) {
    const a = term.domainAnalogies[key];
    if (!a) {
      fail(`${ctx} Perspektive '${key}' fehlt in domainAnalogies`);
    } else {
      if (!a.analogy?.trim()) fail(`${ctx} [${key}] analogy leer`);
      if (!a.explanation?.trim()) fail(`${ctx} [${key}] explanation leer`);
      if (!a.limits?.trim()) fail(`${ctx} [${key}] limits leer (Pflichtfeld)`);
    }
  }

  for (const ref of term.relatedTerms ?? []) {
    if (!knownRef(ref)) fail(`${ctx} relatedTerms enthält unbekannte ID/Slug: '${ref}'`);
  }

  if (!(['basic', 'intermediate', 'advanced'] as string[]).includes(term.difficulty)) {
    fail(`${ctx} ungültiger difficulty-Wert: '${term.difficulty}'`);
  }
  if (!(['low', 'medium', 'high'] as string[]).includes(term.enterpriseRelevance)) {
    fail(`${ctx} ungültiger enterpriseRelevance-Wert: '${term.enterpriseRelevance}'`);
  }
}

// ---------- Perspektiven (domains.json) ----------
const requiredDomainFields: (keyof Domain)[] = [
  'id', 'slug', 'name', 'key', 'icon', 'tagline', 'whyGood', 'bestExplainedTerms', 'helpfulWhen', 'limits',
];
const seenDomainKeys = new Set<string>();

for (const domain of domains) {
  const ctx = `[domain:${domain.id ?? '???'}]`;

  for (const field of requiredDomainFields) {
    if (isEmpty(domain[field])) fail(`${ctx} Pflichtfeld fehlt oder leer: ${field}`);
  }

  if (seenDomainKeys.has(domain.key)) fail(`${ctx} doppelter key: '${domain.key}'`);
  seenDomainKeys.add(domain.key);

  for (const ref of domain.bestExplainedTerms ?? []) {
    if (!knownRef(ref)) fail(`${ctx} bestExplainedTerms enthält unbekannte ID/Slug: '${ref}'`);
  }
}

// ---------- Lernpfade (paths.json) ----------
const requiredPathFields: (keyof LearningPath)[] = [
  'id', 'slug', 'name', 'icon', 'targetAudience', 'description',
];

for (const path of paths) {
  const ctx = `[path:${path.id ?? '???'}]`;

  for (const field of requiredPathFields) {
    if (isEmpty(path[field])) fail(`${ctx} Pflichtfeld fehlt oder leer: ${field}`);
  }
  // lernbogenCTA ist Pflicht, aber nullable: die Property muss existieren (Wert string oder null).
  if (!('lernbogenCTA' in path)) fail(`${ctx} Feld lernbogenCTA fehlt (string oder null erlaubt)`);

  if (path.isMetaCard) continue;
  if (!Array.isArray(path.termOrder) || path.termOrder.length === 0) {
    fail(`${ctx} termOrder ist leer oder kein Array`);
  }
  for (const ref of path.termOrder ?? []) {
    if (!knownRef(ref)) fail(`${ctx} termOrder enthält unbekannte ID/Slug: '${ref}'`);
  }
}

const termCount = glossary.length;
const lensCount = domainKeys.length;
const pathCount = paths.filter((p) => !p.isMetaCard).length;

if (errors === 0) {
  console.log(`VALID: ${termCount} Begriffe, ${lensCount} Perspektiven je mit limits, relatedTerms konsistent`);
  console.log(`       ${termCount * lensCount} Analogien geprüft (${domainKeys.join(', ')})`);
  console.log(`       ${domains.length} Perspektiven- und ${pathCount} Lernpfad-Definitionen vollständig`);
} else {
  console.error(`\nFEHLER: ${errors} Problem(e) gefunden.`);
  throw new Error(`Validierung fehlgeschlagen (${errors} Fehler)`);
}
