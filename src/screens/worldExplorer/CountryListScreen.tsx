import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components';
import {
  CountryCard,
  ExplorerHeader,
} from '@features/worldExplorer/presentation/components';
import {useCountries} from '@features/worldExplorer/presentation/hooks/useCountries';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<WorldExplorerStackParamList, 'CountryList'>;

const CONTINENT_FILTERS = [
  'All',
  'Asia',
  'Europe',
  'Africa',
  'North America',
  'South America',
  'Oceania',
];

export function CountryListScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const {
    filteredCountries,
    loading,
    searchQuery,
    setSearchQuery,
    selectedContinent,
    setSelectedContinent,
  } = useCountries();
  const {progress, exploreCountry} = useWorldExplorerProgress();

  const activeContinentFilter = route.params?.continent ?? selectedContinent;

  const handleSelectCountry = (countryCode: string) => {
    exploreCountry(countryCode);
    navigation.navigate('CountryDetails', {countryCode});
  };

  return (
    <AppSafeAreaView testID="country-list-screen" padded={false}>
      <ExplorerHeader
        title={t('worldExplorer.activities.countries', {
          defaultValue: 'Countries',
        })}
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      {/* Search Input Bar */}
      <View style={styles.searchBarWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('worldExplorer.labels.searchPlaceholder', {
            defaultValue: 'Search country name...',
          })}
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Continent Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {CONTINENT_FILTERS.map(continent => {
            const isActive =
              activeContinentFilter.toLowerCase() === continent.toLowerCase();
            return (
              <Pressable
                key={continent}
                onPress={() => setSelectedContinent(continent)}
                style={({pressed}) => [
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}>
                  {continent === 'All'
                    ? t('worldExplorer.labels.allContinents', {
                        defaultValue: 'All',
                      })
                    : continent}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Country List Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={item => item.code}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          renderItem={({item}) => {
            const isExplored = progress.exploredCountryCodes.includes(
              item.code.toUpperCase(),
            );
            return (
              <CountryCard
                country={item}
                isExplored={isExplored}
                onPress={() => handleSelectCountry(item.code)}
                testID={`country-card-${item.code}`}
              />
            );
          }}
        />
      )}
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '800',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
});
