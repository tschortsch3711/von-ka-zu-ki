// npm run validate — prüft Vollständigkeit und Konsistenz von glossary.json und domains.json

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

type Difficulty = 'basic' | 'intermediate' | 'advanced';
type Relevance = 'low' | 'medium' | 'high';
interface DomainAnalogy { analogy: string; explanation: string; limits: string; }
interface GlossaryTerm {
  id: string; slug: string; term: string; aliases: string[];
  category: string; difficulty: Difficulty; enterpriseRelevance: Relevance;
  shortDefinition: string; technicalDefinition: string; whyItMatters: string;
  misconceptions: string[];
  domainAnalogies: Record<string, DomainAnalogy>;
  relatedTerms: string[]; tags: string[];
}
interface Domain {
  id: string; slug: string; name: string; key: string;
  bestExplainedTerms: string[];
}

const glossary: GlossaryTerm[] = JSON.parse(readFileSync(join(root, 'src/data/glossary.json'), 'utf-8'));
const domains: Domain[] = JSON.parse(readFileSync(join(root, 'src/data/domains.json'), 'utf-8'));

let errors = 0;
const fail = (msg: string) => { console.error(`  ✗ ${msg}`); errors++; };

const domainKeys = domains.map((d) => d.key);
const termIds = new Set(glossary.map((t) => t.id));
const termSlugs = new Set(glossary.map((t) => t.slug));

for (const term of glossary) {
  const ctx = `[${term.id ?? '???'}]`;

  const required = [
    'id', 'slug', 'term', 'category', 'difficulty', 'enterpriseRelevance',
    'shortDefinition', 'technicalDefinition', 'whyItMatters',
    'misconceptions', 'domainAnalogies', 'relatedTerms', 'tags',
  ] as const;
  for (const field of required) {
    const v = term[field];
    if (v === undefined || v === null || v === '') fail(`${ctx} Pflichtfeld fehlt oder leer: ${field}`);
  }

  for (const key of domainKeys) {
    const a = term.domainAnalogies[key];
    if (!a) {
      fail(`${ctx} Brille '${key}' fehlt in domainAnalogies`);
    } else {
      if (!a.analogy?.trim()) fail(`${ctx} [${key}] analogy leer`);
      if (!a.explanation?.trim()) fail(`${ctx} [${key}] explanation leer`);
      if (!a.limits?.trim()) fail(`${ctx} [${key}] limits leer (Pflichtfeld)`);
    }
  }

  for (const ref of term.relatedTerms ?? []) {
    if (!termIds.has(ref) && !termSlugs.has(ref)) {
      fail(`${ctx} relatedTerms enthält unbekannte ID/Slug: '${ref}'`);
    }
  }

  if (!(['basic', 'intermediate', 'advanced'] as string[]).includes(term.difficulty)) {
    fail(`${ctx} ungültiger difficulty-Wert: '${term.difficulty}'`);
  }
  if (!(['low', 'medium', 'high'] as string[]).includes(term.enterpriseRelevance)) {
    fail(`${ctx} ungültiger enterpriseRelevance-Wert: '${term.enterpriseRelevance}'`);
  }
}

for (const domain of domains) {
  for (const ref of domain.bestExplainedTerms ?? []) {
    if (!termIds.has(ref) && !termSlugs.has(ref)) {
      fail(`[domain:${domain.id}] bestExplainedTerms enthält unbekannte ID/Slug: '${ref}'`);
    }
  }
}

const termCount = glossary.length;
const lensCount = domainKeys.length;

if (errors === 0) {
  console.log(`VALID: ${termCount} Begriffe, ${lensCount} Brillen je mit limits, relatedTerms konsistent`);
  console.log(`       ${termCount * lensCount} Analogien geprüft (${domainKeys.join(', ')})`);
} else {
  console.error(`\nFEHLER: ${errors} Problem(e) gefunden.`);
  throw new Error(`Validierung fehlgeschlagen (${errors} Fehler)`);
}
