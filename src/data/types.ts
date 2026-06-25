// Datenmodell fuer Glossar und Domaenenbrillen.
// Erweiterbar gehalten: v2 kann Begriffe und Brillen ergaenzen, ohne das Schema umzubauen.

export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type Relevance = 'low' | 'medium' | 'high';

export interface DomainAnalogy {
  analogy: string;
  explanation: string;
  /** Pflichtfeld: Analogien lecken immer. Hier steht die ehrliche Grenze. */
  limits: string;
}

export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  aliases: string[];
  category: string;
  difficulty: Difficulty;
  enterpriseRelevance: Relevance;
  shortDefinition: string;
  technicalDefinition: string;
  whyItMatters: string;
  misconceptions: string[];
  /** Schluessel entsprechen domains.json (z.B. automotive, publicSector, healthcare). */
  domainAnalogies: Record<string, DomainAnalogy>;
  relatedTerms: string[];
  tags: string[];
}

/** Eine Showcase-Zeile: bekannter Begriff dieser Berufswelt -> KI-Begriff. */
export interface ShowcaseMapping {
  icon: string;
  from: string;
  to: string;
}

export interface Domain {
  id: string;
  slug: string;
  name: string;
  /** Schluessel, unter dem die Brille in glossary.json -> domainAnalogies referenziert wird. */
  key: string;
  icon: string;
  tagline: string;
  whyGood: string;
  bestExplainedTerms: string[];
  helpfulWhen: string;
  limits: string;
  /** Optionale Showcase-Zuordnung (bekannte Begriffe -> KI-Begriffe). */
  showcase?: ShowcaseMapping[];
}

export interface LearningPath {
  id: string;
  slug: string;
  name: string;
  icon: string;
  targetAudience: string;
  description: string;
  termOrder: string[];
  lernbogenCTA: string | null;
  isMetaCard?: boolean;
}
