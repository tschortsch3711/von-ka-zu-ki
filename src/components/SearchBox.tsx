import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import type { GlossaryTerm, Domain } from '../data/types';

interface Props {
  terms: GlossaryTerm[];
  domains: Domain[];
}

const difficultyLabel: Record<string, string> = {
  basic: 'Einstieg',
  intermediate: 'Aufbau',
  advanced: 'Vertiefung',
};
const relevanceLabel: Record<string, string> = { low: 'gering', medium: 'mittel', high: 'hoch' };

// Base-bewusste Linkaufloesung, auch clientseitig (Vite inlined BASE_URL).
const base = import.meta.env.BASE_URL;
const termHref = (slug: string) => `${base}/glossar/${slug}/`.replace(/\/{2,}/g, '/');

export default function SearchBox({ terms, domains }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [lens, setLens] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [relevance, setRelevance] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(terms.map((t) => t.category))),
    [terms],
  );
  const domainIcons = useMemo(
    () => Object.fromEntries(domains.map((d) => [d.key, d.icon])),
    [domains],
  );

  const fuse = useMemo(
    () =>
      new Fuse(terms, {
        keys: [
          { name: 'term', weight: 3 },
          { name: 'aliases', weight: 2 },
          { name: 'category', weight: 1 },
          { name: 'tags', weight: 1 },
          { name: 'shortDefinition', weight: 1.5 },
        ],
        threshold: 0.38,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [terms],
  );

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : terms.slice().sort((a, b) => a.term.localeCompare(b.term, 'de'));

    if (category) list = list.filter((t) => t.category === category);
    if (lens) list = list.filter((t) => Object.keys(t.domainAnalogies).includes(lens));
    if (difficulty) list = list.filter((t) => t.difficulty === difficulty);
    if (relevance) list = list.filter((t) => t.enterpriseRelevance === relevance);
    return list;
  }, [query, category, lens, difficulty, relevance, fuse, terms]);

  const activeFilters = [category, lens, difficulty, relevance].filter(Boolean).length;
  const reset = () => {
    setQuery('');
    setCategory('');
    setLens('');
    setDifficulty('');
    setRelevance('');
  };

  return (
    <div className="search">
      <label className="search__field">
        <span className="sr-only">Begriffe durchsuchen</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Begriff, Alias oder Stichwort suchen…"
          aria-label="Begriffe durchsuchen"
          autoComplete="off"
        />
      </label>

      <div className="search__facets" role="group" aria-label="Filter">
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Kategorie">
          <option value="">Alle Kategorien</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={lens} onChange={(e) => setLens(e.target.value)} aria-label="Domänenbrille">
          <option value="">Alle Brillen</option>
          {domains.map((d) => (
            <option key={d.key} value={d.key}>{d.icon} {d.name}</option>
          ))}
        </select>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Schwierigkeitsgrad">
          <option value="">Jeder Grad</option>
          <option value="basic">Einstieg</option>
          <option value="intermediate">Aufbau</option>
          <option value="advanced">Vertiefung</option>
        </select>

        <select value={relevance} onChange={(e) => setRelevance(e.target.value)} aria-label="Enterprise-Relevanz">
          <option value="">Jede Relevanz</option>
          <option value="high">Enterprise: hoch</option>
          <option value="medium">Enterprise: mittel</option>
          <option value="low">Enterprise: gering</option>
        </select>

        {(activeFilters > 0 || query) && (
          <button type="button" className="search__reset" onClick={reset}>
            Zurücksetzen
          </button>
        )}
      </div>

      <p className="search__count" aria-live="polite">
        {results.length} {results.length === 1 ? 'Begriff' : 'Begriffe'}
        {query ? ` für „${query}“` : ''}
      </p>

      {results.length === 0 ? (
        <p className="search__empty">Keine Treffer. Filter anpassen oder Suchbegriff ändern.</p>
      ) : (
        <div className="search__grid">
          {results.map((t) => (
            <a key={t.id} className="search-card" href={termHref(t.slug)}>
              <div className="search-card__head">
                <h3>{t.term}</h3>
                <span className="badge badge--accent">{t.category}</span>
              </div>
              <p className="search-card__def">{t.shortDefinition}</p>
              <div className="search-card__meta">
                <span className="badge">{difficultyLabel[t.difficulty] ?? t.difficulty}</span>
                <span className="badge">Enterprise: {relevanceLabel[t.enterpriseRelevance]}</span>
                <span className="search-card__lenses" aria-label="Verfügbare Brillen">
                  {Object.keys(t.domainAnalogies).map((k) => (
                    <span key={k} title={k}>{domainIcons[k] ?? '•'}</span>
                  ))}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
