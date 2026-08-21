import {useCallback, useEffect} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {speakCoachLine} from '@shared/speech/tamilCoachSpeech';
import {useCountries} from '@features/worldExplorer/presentation/hooks/useCountries';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<
  WorldExplorerStackParamList,
  'CountryDetails'
>;

export function CountryDetailsScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const {countryCode} = route.params;
  const {countries} = useCountries();
  const {progress, exploreCountry} = useWorldExplorerProgress();

  const country = countries.find(
    c => c.code.toUpperCase() === countryCode.toUpperCase(),
  );

  useEffect(() => {
    if (countryCode) {
      exploreCountry(countryCode);
    }
  }, [countryCode, exploreCountry]);

  const speakFact = useCallback(() => {
    if (country?.funFact) {
      void speakCoachLine(country.funFact);
    }
  }, [country?.funFact]);

  if (!country) {
    return (
      <AppSafeAreaView testID="country-details-screen">
        <LearningHeader
          title={t('worldExplorer.title', {defaultValue: 'World Explorer'})}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Country not found</Text>
        </View>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView testID="country-details-screen" padded={false}>
      <LearningHeader
        title={country.name}
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Large Flag Circle Header */}
        <View style={styles.flagHeaderWrap}>
          <View style={styles.flagBadge}>
            <Text style={styles.flagEmoji}>{country.flag}</Text>
          </View>

          <Text style={styles.nameText}>{country.name}</Text>
          {country.officialName && country.officialName !== country.name && (
            <Text style={styles.officialNameText}>{country.officialName}</Text>
          )}

          <View style={styles.continentPill}>
            <Text style={styles.continentText}>{country.continent}</Text>
          </View>
        </View>

        {/* Fact Card with Speaker Button */}
        {country.funFact && (
          <View style={styles.factCard}>
            <View style={styles.factHeaderRow}>
              <Text style={styles.factLabel}>
                💡{' '}
                {t('worldExplorer.labels.funFact', {defaultValue: 'Fun Fact'})}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={speakFact}
                style={({pressed}) => [
                  styles.audioBtn,
                  pressed && styles.btnPressed,
                ]}>
                <Text style={styles.audioIcon}>🔊</Text>
                <Text style={styles.audioText}>
                  {t('worldExplorer.labels.listen', {defaultValue: 'Listen'})}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.factText}>{country.funFact}</Text>
          </View>
        )}

        {/* Info Grid Cards */}
        <View style={styles.infoGrid}>
          {country.capital && (
            <View style={styles.infoTile}>
              <Text style={styles.tileIcon}>🏛️</Text>
              <Text style={styles.tileLabel}>
                {t('worldExplorer.labels.capital', {defaultValue: 'Capital'})}
              </Text>
              <Text style={styles.tileValue}>{country.capital}</Text>
            </View>
          )}

          <View style={styles.infoTile}>
            <Text style={styles.tileIcon}>🗺️</Text>
            <Text style={styles.tileLabel}>
              {t('worldExplorer.labels.continent', {defaultValue: 'Continent'})}
            </Text>
            <Text style={styles.tileValue}>{country.continent}</Text>
          </View>

          {country.languages && country.languages.length > 0 && (
            <View style={styles.infoTile}>
              <Text style={styles.tileIcon}>🗣️</Text>
              <Text style={styles.tileLabel}>
                {t('worldExplorer.labels.languages', {
                  defaultValue: 'Languages',
                })}
              </Text>
              <Text style={styles.tileValue}>
                {country.languages.join(', ')}
              </Text>
            </View>
          )}

          {country.currencies && country.currencies.length > 0 && (
            <View style={styles.infoTile}>
              <Text style={styles.tileIcon}>🪙</Text>
              <Text style={styles.tileLabel}>
                {t('worldExplorer.labels.currency', {defaultValue: 'Currency'})}
              </Text>
              <Text style={styles.tileValue}>
                {country.currencies.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
  },
  flagHeaderWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  flagBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  flagEmoji: {
    fontSize: 58,
  },
  nameText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  officialNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  continentPill: {
    marginTop: 10,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  continentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  factCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FCD34D',
    gap: 8,
  },
  factHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  factLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  btnPressed: {
    opacity: 0.8,
  },
  audioIcon: {
    fontSize: 14,
  },
  audioText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  factText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78350F',
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoTile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  tileIcon: {
    fontSize: 24,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tileValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
});
