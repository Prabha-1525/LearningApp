import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {Country} from '../../domain/entities/Country';
import {CURATED_COUNTRIES} from '../../domain/catalog/curatedCountries';
import {fetchAllCountriesApi} from '../api/countryApi';

const CACHE_KEY = StorageKeys.module('worldExplorer', 'countriesCache');
const CACHE_TIMESTAMP_KEY = StorageKeys.module(
  'worldExplorer',
  'countriesCacheTime',
);
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days cache TTL

export function readCachedCountries(): readonly Country[] | null {
  try {
    const raw = mmkvStorage.getString(CACHE_KEY);
    const timestampStr = mmkvStorage.getString(CACHE_TIMESTAMP_KEY);
    if (!raw || !timestampStr) {
      return null;
    }
    const timestamp = Number(timestampStr);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      return null; // Expired cache
    }
    const parsed = JSON.parse(raw) as Country[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCachedCountries(countries: readonly Country[]): void {
  try {
    mmkvStorage.setString(CACHE_KEY, JSON.stringify(countries));
    mmkvStorage.setString(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch {
    // optional cache save catch
  }
}

export async function getCountriesData(): Promise<readonly Country[]> {
  const cached = readCachedCountries();
  if (cached && cached.length >= 10) {
    return cached;
  }

  const fresh = await fetchAllCountriesApi();
  if (fresh && fresh.length > 0) {
    writeCachedCountries(fresh);
    return fresh;
  }

  return CURATED_COUNTRIES;
}
