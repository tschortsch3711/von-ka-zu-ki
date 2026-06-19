# Glossar-Grundidee

## Ein Begriff, eine Definition, mehrere Erklärwelten

Das Herzstück ist ein einfaches, aber tragfähiges Prinzip: **Jeder Begriff hat genau eine fachlich
korrekte Definition** und wird zusätzlich über **mehrere Domänenbrillen** erklärt.

## Aufbau eines Begriffs

Jeder Eintrag in [`src/data/glossary.json`](../src/data/glossary.json) folgt diesem Schema:

| Feld                 | Bedeutung                                                            |
| -------------------- | ------------------------------------------------------------------- |
| `id` / `slug`        | eindeutiger Bezeichner und URL-Pfad                                 |
| `term`               | Anzeigename                                                          |
| `aliases`            | alternative Bezeichnungen (auch für die Suche)                      |
| `category`           | Einordnung im Lernbogen                                             |
| `difficulty`         | `basic` / `intermediate` / `advanced`                               |
| `enterpriseRelevance`| `low` / `medium` / `high`                                           |
| `shortDefinition`    | ein Satz für Karten und Suchtreffer                                 |
| `technicalDefinition`| die fachlich korrekte Definition                                    |
| `whyItMatters`       | warum der Begriff praktisch relevant ist                            |
| `misconceptions`     | typische Missverständnisse                                          |
| `domainAnalogies`    | je Brille: `analogy`, `explanation`, **`limits` (Pflicht)**          |
| `relatedTerms`       | Querverweise für den Lernbogen                                      |
| `tags`               | Schlagworte für Suche und Filter                                    |

## Der Lernbogen

Die Begriffe sind als Bogen angelegt – von Grundlagen über Funktionsweise und die agentische Schicht
bis zu Enterprise und Sicherheit:

1. **Grundlagen** – KI/AI, Machine Learning, LLM, Foundation Model, Inferenz, Training & Fine-Tuning
2. **Funktionsweise** – Token, Kontextfenster, Prompt, Halluzination
3. **Agentische Schicht** – KI-Agent, Tool/Function Calling, MCP, RAG, Embeddings
4. **Enterprise & Sicherheit** – AI Governance, Guardrails, Prompt Injection

Die `relatedTerms` verbinden die Begriffe so, dass man dem Bogen folgen oder quer einsteigen kann.

## Warum `limits` Pflicht ist

Eine Analogie, die ihre eigene Grenze nicht benennt, verführt zu falschen Schlüssen. Indem jede
Analogie ein `limits`-Feld trägt, bleibt das Versprechen ehrlich: Die Brille hilft beim Sehen,
ersetzt aber nicht den Blick auf die Sache selbst.
