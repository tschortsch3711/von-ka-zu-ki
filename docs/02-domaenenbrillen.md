# Perspektiven (Domänenbrillen)

Eine **Perspektive** ist eine bekannte Erfahrungswelt, durch die man einen abstrakten KI-Begriff
betrachtet. Sie verändert nicht die Sache, sondern die Sicht darauf. (Im Datenmodell und in der
URL heißt das Konzept weiterhin „Domäne" – `src/data/domains.json`, Route `/domaenen/`.)

## Die vier Perspektiven

### 🚗 Automotive / Mobility

Fast jeder hat eine Vorstellung davon, wie ein Auto funktioniert. Diese Perspektive überträgt Rollen wie
Fahrer, Motor, Sprit, Straße, Werkstatt und TÜV auf das KI-Ökosystem. Sie ist stark beim Erklären von
**Zusammenspiel und Rollen**.

### 🏛️ Public Sector / Verwaltung

Verwaltung lebt von Zuständigkeiten, Aktenlauf und der Trennung von Vorbereitung und verbindlicher
Entscheidung. Diese Perspektive ist stark bei **Verantwortung, Nachvollziehbarkeit und Regelbindung**.

### 🩺 Healthcare

Im Gesundheitswesen ist die Abstufung von Verantwortung selbstverständlich. Diese Perspektive ist stark beim
Erklären von **Unterstützung versus Verantwortung, Evidenz und Freigabe**.

### 🏦 Finance & Banking

Finance-Fachleute denken in Risiko, Modell, Schwellenwert und Regulierung – genau die Konzepte, die
KI-Systeme ebenfalls abbilden. Diese Perspektive ist stark bei **Risikomodellierung, Schwellenwerten und
Compliance** und spricht Banker, Risikocontroller, Compliance-Beauftragte und Regulatoren an.

## Die vier Leitfragen pro Perspektive

Jede Perspektive (siehe [`src/data/domains.json`](../src/data/domains.json)) beantwortet:

1. **Warum als Analogie geeignet?** (`whyGood`)
2. **Welche Begriffe lassen sich besonders gut darüber erklären?** (`bestExplainedTerms`)
3. **Wo hilft die Perspektive?** (`helpfulWhen`)
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

Wichtig: Das ist **eine** Perspektive von vieren. Sie ist anschaulich, aber unterschätzt die
probabilistische, nicht-deterministische Natur von KI – siehe das `limits`-Feld der Automotive-Perspektive.

## Erweiterung auf weitere Perspektiven (v2)

Weitere Perspektiven lassen sich ergänzen, indem man eine neue Domäne in `domains.json` anlegt und in jedem
Begriff unter `domainAnalogies` einen Eintrag mit dem neuen Schlüssel hinzufügt – inklusive `limits`.
