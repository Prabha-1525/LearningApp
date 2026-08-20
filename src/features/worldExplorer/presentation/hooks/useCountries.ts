import {useCallback, useEffect, useMemo, useState} from 'react';

import type {Country} from '../../domain/entities/Country';
import {getCountriesData} from '../../data/cache/countryCache';

export function useCountries() {
  const [countries, setCountries] = useState<readonly Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getCountriesData();
    setCountries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredCountries = useMemo(() => {
    let list = countries;

    if (selectedContinent && selectedContinent !== 'All') {
      list = list.filter(
        c => c.continent.toLowerCase() === selectedContinent.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          (c.capital && c.capital.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [countries, searchQuery, selectedContinent]);

  return {
    countries,
    filteredCountries,
    loading,
    searchQuery,
    setSearchQuery,
    selectedContinent,
    setSelectedContinent,
    reload: loadData,
  };
}
