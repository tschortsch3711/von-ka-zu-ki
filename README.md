# Von K.A. zu K.I.

> Ein universelles, analogiebasiertes KI-Glossar mit Domänenbrillen.

Ein verständliches KI-Glossar, das zentrale Begriffe fachlich korrekt erklärt und über bekannte
Domänen wie **Automotive**, **Public Sector** und **Healthcare** greifbar macht.

🌐 **Live:** <https://tschortsch3711.github.io/von-ka-zu-ki/>

## Zielgruppe

Menschen, die mit KI zu tun haben, aber keine KI-Expertinnen oder -Experten sind:
Fach- und Führungskräfte, Verwaltung, Gesundheitswesen, Mobilitätsbranche, Einsteiger und alle,
die zentrale Begriffe sauber einordnen wollen, ohne sich in Buzzwords zu verlieren.

## Motivation

KI-Begriffe werden oft entweder zu technisch oder zu schwammig erklärt. Dieses Projekt geht einen
dritten Weg: **eine fachlich korrekte Definition pro Begriff, mehrere Erklärwelten daneben.**
Wer in Autos denkt, bekommt die Auto-Brille; wer in Verwaltungsvorgängen denkt, die Verwaltungsbrille;
wer aus dem Gesundheitswesen kommt, die Healthcare-Brille.

## Grundprinzip: ein Begriff, eine Definition, mehrere Erklärwelten

Jeder Begriff hat:

- eine **fachliche Definition** (korrekt, nicht verwässert),
- den Abschnitt **„warum das wichtig ist“**,
- typische **Missverständnisse**,
- **drei Domänenbrillen** mit je einer Analogie, einer Erklärung und – verpflichtend –
  einer **ehrlichen Grenze** (`limits`).

> Analogien lecken immer. Genau das ist Teil der Aussage: Jede Brille zeigt eine Seite und verschweigt
> eine andere. Die `limits` machen das explizit.

## Tech-Stack und warum

| Baustein            | Wahl                       | Begründung                                                                 |
| ------------------- | -------------------------- | -------------------------------------------------------------------------- |
| Framework           | **Astro** (reines Astro)   | Statische Ausgabe, volle Layout-Kontrolle. **Kein Starlight**, um Design und Datenmodell selbst zu bestimmen, statt sich einem Docs-Theme zu unterwerfen. |
| Sprache             | **TypeScript**             | Typisiertes, erweiterbares Datenmodell (`src/data/types.ts`).              |
| Suche               | **Fuse.js** + JS-Facetten  | Reine Clientsuche über `glossary.json`, ohne Backend und ohne Build-Index. **Kein Pagefind**, weil das Datenvolumen klein ist und volle Kontrolle über Facettenfilter gewünscht war. |
| Interaktive Insel   | **React** (nur Suche)      | Eine einzige hydratisierte Insel für die Suche; der Rest ist statisches HTML. |
| Diagramme           | **Inline-SVG / CSS**       | Keine externen Bild- oder CDN-Abhängigkeiten, hält die Datenschutzerklärung schlank. |
| Hosting             | **GitHub Pages**           | Kostenlos, statisch, via GitHub Actions deployed.                          |

Keine Server-Komponente, keine API-Keys, keine externen KI-APIs, keine Secrets.

## Lokale Entwicklung

```bash
npm install
npm run dev      # Dev-Server, i. d. R. http://localhost:4321/von-ka-zu-ki/
```

## Build

```bash
npm run build    # statische Ausgabe nach ./dist
npm run preview  # gebaute Seite lokal ansehen
```

## Deployment zu GitHub Pages

Das Deployment läuft automatisch über GitHub Actions
([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) bei jedem Push auf `main`.

> **Wichtig – `base` und `site`:** In [`astro.config.mjs`](astro.config.mjs) sind gesetzt:
>
> ```js
> site: 'https://tschortsch3711.github.io',
> base: '/von-ka-zu-ki',
> ```
>
> Weil die Seite unter einem **Unterpfad** liegt, müssen **alle internen Links und Assets** über
> `import.meta.env.BASE_URL` aufgelöst werden (siehe [`src/lib/paths.ts`](src/lib/paths.ts)),
> niemals hart `/`-relativ. Das ist der häufigste GitHub-Pages-Fehler bei Astro.

In den Repository-Einstellungen ist **Settings → Pages → Source = GitHub Actions** aktiv.

## Content-Struktur

```text
src/
├── data/
│   ├── glossary.json   # alle Begriffe (das inhaltliche Herzstück)
│   ├── domains.json    # die drei Domänenbrillen
│   └── types.ts        # das TypeScript-Datenmodell
├── pages/              # Routen (Index, Glossar, Domänen, Roadmap, Recht)
├── components/         # Hero, Suche, Karten, fünf Diagramme
├── layouts/            # BaseLayout (Header, Nav, Footer, Theme)
└── styles/global.css   # Designsystem, Hell-/Dunkelmodus

docs/                   # längere Hintergrundtexte (Vision, Grundidee, Brillen, Roadmap)
```

## Einen neuen Begriff ergänzen

1. In [`src/data/glossary.json`](src/data/glossary.json) ein Objekt nach dem Schema in
   [`src/data/types.ts`](src/data/types.ts) ergänzen.
2. **Pflichtfelder** beachten: `id`, `slug`, `term`, `category`, `difficulty`, `enterpriseRelevance`,
   `shortDefinition`, `technicalDefinition`, `whyItMatters`, `misconceptions`, `domainAnalogies`,
   `relatedTerms`, `tags`.
3. In `domainAnalogies` **alle drei Brillen** (`automotive`, `publicSector`, `healthcare`) füllen –
   jede mit `analogy`, `explanation` **und** `limits`. Das `limits`-Feld ist **Pflicht**.
4. `relatedTerms` nur auf existierende `id`/`slug` setzen (Konsistenz hält den Lernbogen zusammen).

Seiten und Suche aktualisieren sich automatisch; es ist kein Code nötig.

## Eine neue Domänenbrille ergänzen (v2)

1. In [`src/data/domains.json`](src/data/domains.json) eine Brille mit
   `id`, `slug`, `name`, `key`, `icon`, `tagline`, `whyGood`, `bestExplainedTerms`, `helpfulWhen`, `limits` anlegen.
2. In **jedem** Begriff in `glossary.json` unter `domainAnalogies` einen Eintrag mit dem neuen `key` ergänzen.

Das Schema ist bewusst erweiterbar gehalten, damit v2 ohne Umbau Begriffe und Brillen ergänzen kann.

## Datenschutz und Inhalte

- Die Seite setzt **keine Cookies**, nutzt **kein Tracking** und lädt **keine externen Ressourcen**.
  Die Suche läuft vollständig im Browser.
- Es sind **keine Unternehmensinterna**, keine kundenspezifischen oder sensiblen Inhalte enthalten.
- **Impressum und Datenschutzerklärung** sind als Platzhalter angelegt und müssen vor Veröffentlichung
  mit echten Daten gefüllt werden (siehe die mit „Nikola: hier eigene Daten eintragen“ markierten Stellen).

## Lizenz

- **Code:** [MIT](./LICENSE)
- **Inhalte:** [CC BY-SA 4.0](./LICENSE-CONTENT.md)

© 2026 [tschortsch3711](https://github.com/tschortsch3711)
