import type {Country} from '../../domain/entities/Country';
import {CURATED_COUNTRIES} from '../../domain/catalog/curatedCountries';

const REST_COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,capital,continents,region,subregion,languages,currencies,population';

export function codeToFlagEmoji(code: string): string {
  if (!code || code.length !== 2) {
    return '🌐';
  }
  const upper = code.toUpperCase();
  const first = upper.charCodeAt(0) + 127397;
  const second = upper.charCodeAt(1) + 127397;
  return String.fromCodePoint(first, second);
}

type RawRestCountry = {
  cca2?: string;
  cca3?: string;
  name?: {
    common?: string;
    official?: string;
  };
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  capital?: string[];
  continents?: string[];
  region?: string;
  subregion?: string;
  languages?: Record<string, string>;
  currencies?: Record<string, {name?: string; symbol?: string}>;
  population?: number;
};

export function normalizeCountry(raw: RawRestCountry): Country | null {
  const code = (raw.cca2 ?? raw.cca3 ?? '').toUpperCase();
  const name = raw.name?.common?.trim();
  if (!code || !name) {
    return null;
  }

  const flagEmoji = codeToFlagEmoji(code);
  const capital = raw.capital?.[0] ?? undefined;
  const continent = raw.continents?.[0] ?? raw.region ?? 'Other';
  const languages = raw.languages ? Object.values(raw.languages) : [];
  const currencies = raw.currencies
    ? Object.values(raw.currencies)
        .map(c => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
        .filter((c): c is string => Boolean(c))
    : [];

  const matchedCurated = CURATED_COUNTRIES.find(
    c => c.code.toUpperCase() === code,
  );

  return {
    code,
    name,
    officialName: raw.name?.official ?? name,
    flag: flagEmoji,
    flagUrl: raw.flags?.png ?? raw.flags?.svg,
    capital,
    continent,
    region: raw.region,
    subregion: raw.subregion,
    languages: languages.length > 0 ? languages : undefined,
    currencies: currencies.length > 0 ? currencies : undefined,
    population: raw.population,
    funFact:
      matchedCurated?.funFact ??
      `${name} is a beautiful country located in ${continent}!`,
  };
}

export async function fetchAllCountriesApi(): Promise<readonly Country[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(REST_COUNTRIES_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return CURATED_COUNTRIES;
    }

    const rawList = (await response.json()) as RawRestCountry[];
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return CURATED_COUNTRIES;
    }

    const normalized = rawList
      .map(normalizeCountry)
      .filter((c): c is Country => c !== null);

    return normalized.length > 0 ? normalized : CURATED_COUNTRIES;
  } catch {
    return CURATED_COUNTRIES;
  }
}
