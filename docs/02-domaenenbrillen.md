# Domänenbrillen

Eine **Domänenbrille** ist eine bekannte Erfahrungswelt, durch die man einen abstrakten KI-Begriff
betrachtet. Die Brille verändert nicht die Sache, sondern die Sicht darauf.

## Die drei Brillen in v1

### 🚗 Automotive / Mobility

Fast jeder hat eine Vorstellung davon, wie ein Auto funktioniert. Diese Brille überträgt Rollen wie
Fahrer, Motor, Sprit, Straße, Werkstatt und TÜV auf das KI-Ökosystem. Sie ist stark beim Erklären von
**Zusammenspiel und Rollen**.

### 🏛️ Public Sector / Verwaltung

Verwaltung lebt von Zuständigkeiten, Aktenlauf und der Trennung von Vorbereitung und verbindlicher
Entscheidung. Diese Brille ist stark bei **Verantwortung, Nachvollziehbarkeit und Regelbindung**.

### 🩺 Healthcare

Im Gesundheitswesen ist die Abstufung von Verantwortung selbstverständlich. Diese Brille ist stark beim
Erklären von **Unterstützung versus Verantwortung, Evidenz und Freigabe**.

## Die vier Leitfragen pro Brille

Jede Brille (siehe [`src/data/domains.json`](../src/data/domains.json)) beantwortet:

1. **Warum als Analogie geeignet?** (`whyGood`)
2. **Welche Begriffe lassen sich besonders gut darüber erklären?** (`bestExplainedTerms`)
3. **Wo hilft die Brille?** (`helpfulWhen`)
4. **Wo stößt sie an Grenzen?** (`limits`)

## Die Auto-Showcase-Zuordnung

Als durchgängiges Beispiel bleibt die Auto-Zuordnung erhalten:

| Auto-Begriff        | KI-Begriff             |
| ------------------- | ---------------------- |
| Fahrer / Fahrzeug   | KI-Agent               |
| Motor               | Modell (LLM)           |
| Sprit / Verbrauch   | Tokens                 |
| Tankkarte           | API-Key                |
| Straße / Anschluss  | API / MCP              |
| Raffinerie          | Rechenzentrum          |
| Werkstatt           | Training / Fine-Tuning |
| TÜV                 | AI Governance          |
| Flottenmanager      | Unternehmen            |

Wichtig: Das ist **eine** Brille von dreien. Sie ist anschaulich, aber unterschätzt die probabilistische,
nicht-deterministische Natur von KI – siehe das `limits`-Feld der Automotive-Brille.

## Erweiterung auf weitere Brillen (v2)

Weitere Brillen lassen sich ergänzen, indem man eine neue Domäne in `domains.json` anlegt und in jedem
Begriff unter `domainAnalogies` einen Eintrag mit dem neuen Schlüssel hinzufügt – inklusive `limits`.
