import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SEASONS_DATA} from '../../domain/catalog/timeData';
import type {SeasonInfo} from '../../domain/entities/timeEntities';

type SeasonsSceneViewProps = {
  readonly onExploreAll?: () => void;
};

export function SeasonsSceneView({onExploreAll}: SeasonsSceneViewProps) {
  const {t} = useTranslation();
  const [selectedSeason, setSelectedSeason] = useState<SeasonInfo>(
    SEASONS_DATA[0],
  );
  const [exploredSet, setExploredSet] = useState<Set<string>>(
    new Set([SEASONS_DATA[0].id]),
  );

  const handleSelectSeason = (season: SeasonInfo) => {
    setSelectedSeason(season);
    const nextSet = new Set(exploredSet).add(season.id);
    setExploredSet(nextSet);
    if (nextSet.size === SEASONS_DATA.length) {
      onExploreAll?.();
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* 4 Season Selector Pills */}
      <View style={styles.selectorRow}>
        {SEASONS_DATA.map((s: SeasonInfo) => {
          const isSelected = s.id === selectedSeason.id;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              onPress={() => handleSelectSeason(s)}
              style={[
                styles.seasonPill,
                {borderColor: s.color},
                isSelected && {backgroundColor: s.color},
              ]}>
              <Text style={styles.pillIcon}>{s.icon}</Text>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                {t(s.nameKey, s.id)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Main Animated Seasonal Stage / Scene Card */}
      <View
        style={[
          styles.sceneCard,
          {
            backgroundColor: selectedSeason.bgGradient[0],
            borderColor: selectedSeason.color,
          },
        ]}>
        <View style={styles.sceneBanner}>
          <Text style={styles.sceneBigIcon}>{selectedSeason.icon}</Text>
          <View style={styles.sceneTitleWrap}>
            <Text style={[styles.sceneTitle, {color: selectedSeason.color}]}>
              {t(selectedSeason.nameKey, selectedSeason.id)} Season
            </Text>
            <Text style={styles.sceneMonths}>
              🗓️ {t(selectedSeason.monthsKey, '')}
            </Text>
          </View>
        </View>

        {/* Visual elements floating strip */}
        <View style={styles.visualStrip}>
          {selectedSeason.visualElements.map((elem, idx) => (
            <View key={idx} style={styles.visualItemCircle}>
              <Text style={styles.visualItemText}>{elem}</Text>
            </View>
          ))}
        </View>

        {/* Detailed Attribute Cards */}
        <View style={styles.detailsGrid}>
          {/* Weather */}
          <View style={styles.detailCard}>
            <Text style={styles.detailHeader}>🌤️ Weather</Text>
            <Text style={styles.detailBody}>
              {t(selectedSeason.weatherKey, '')}
            </Text>
          </View>

          {/* Clothes to wear */}
          <View style={styles.detailCard}>
            <Text style={styles.detailHeader}>👕 What to Wear</Text>
            <Text style={styles.detailBody}>
              {t(selectedSeason.clothesKey, '')}
            </Text>
          </View>

          {/* Activities */}
          <View style={styles.detailCard}>
            <Text style={styles.detailHeader}>🏄 Fun Activities</Text>
            <Text style={styles.detailBody}>
              {t(selectedSeason.activitiesKey, '')}
            </Text>
          </View>

          {/* Fun Fact */}
          <View style={[styles.detailCard, styles.funFactCard]}>
            <Text style={styles.funFactHeader}>💡 Did You Know?</Text>
            <Text style={styles.funFactBody}>
              {t(selectedSeason.funFactKey, '')}
            </Text>
          </View>
        </View>
      </View>

      {/* Locale Adaptation Spotlight */}
      <View style={styles.localeNoteCard}>
        <Text style={styles.localeNoteTitle}>
          🌍 Monsoon in India & Tropical Regions
        </Text>
        <Text style={styles.localeNoteText}>
          In India, the Rainy Season is known as the{' '}
          <Text style={styles.monsoonAccent}>Monsoon</Text>! It brings lovely
          cool showers, blooming plants, peacocks dancing, and hot snacks like
          pakoras! 🌧️🦚
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  monsoonAccent: {
    fontWeight: '900',
    color: '#0284C7',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  seasonPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pillIcon: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  sceneCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 2.5,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sceneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sceneBigIcon: {
    fontSize: 48,
  },
  sceneTitleWrap: {
    flex: 1,
    gap: 2,
  },
  sceneTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  sceneMonths: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  visualStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 8,
    borderRadius: 16,
  },
  visualItemCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  visualItemText: {
    fontSize: 22,
  },
  detailsGrid: {
    gap: 10,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  detailHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  detailBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  funFactCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  funFactHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  funFactBody: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350F',
    lineHeight: 18,
  },
  localeNoteCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    gap: 6,
  },
  localeNoteTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0369A1',
  },
  localeNoteText: {
    fontSize: 13,
    color: '#0C4A6E',
    lineHeight: 19,
  },
});
