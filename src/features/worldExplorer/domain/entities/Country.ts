export type Country = {
  readonly code: string; // cca2 / cca3 (e.g. 'IN', 'IND')
  readonly name: string; // Common name (e.g. 'India')
  readonly officialName?: string; // Official name (e.g. 'Republic of India')
  readonly flag: string; // Emoji flag or URL (e.g. '🇮🇳')
  readonly flagUrl?: string; // PNG/SVG URL
  readonly capital?: string; // Primary capital city
  readonly continent: string; // Primary continent name (e.g. 'Asia')
  readonly region?: string;
  readonly subregion?: string;
  readonly languages?: readonly string[];
  readonly currencies?: readonly string[];
  readonly population?: number;
  readonly funFact?: string; // Child-friendly simple sentence
};
