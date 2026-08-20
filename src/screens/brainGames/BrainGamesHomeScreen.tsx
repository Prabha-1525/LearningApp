import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';

import {BRAIN_GAMES} from '../../features/brainGames/domain/entities/BrainGame';
import {isGameUnlocked} from '../../features/brainGames/domain/policies/unlockRules';
import {readBrainGamesProgress} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesProgress} from '../../features/brainGames/domain/entities/GameProgress';
import {GameCard} from '../../features/brainGames/presentation/components/GameCard';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<BrainGamesStackParamList, 'Home'>;

const GAME_SCREEN_MAP: Record<string, keyof BrainGamesStackParamList> = {
  'memory-match': 'MemoryMatch',
  'matching-pairs': 'MatchingPairs',
  'pattern-completer': 'PatternCompleter',
  'odd-one-out': 'OddOneOut',
  'number-sequence': 'NumberSequence',
  'sort-it': 'SortIt',
  'find-the-difference': 'FindDifference',
};

export function BrainGamesHomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<BrainGamesProgress>(
    readBrainGamesProgress(),
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(readBrainGamesProgress());
    }, []),
  );

  const unlockedCount = BRAIN_GAMES.filter(g =>
    isGameUnlocked(g.id, progress),
  ).length;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F1F5FF">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🧠</Text>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {t('brainGames.home.title', 'Brain Games')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t('brainGames.home.subtitle', 'Train your brain!')}
          </Text>
        </View>
        <View style={styles.starPill}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starCount}>{progress.totalStars}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          {t('brainGames.home.unlocked', {
            count: unlockedCount,
            total: BRAIN_GAMES.length,
            defaultValue: `${unlockedCount} / ${BRAIN_GAMES.length} games unlocked`,
          })}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {width: `${(unlockedCount / BRAIN_GAMES.length) * 100}%`},
            ]}
          />
        </View>
      </View>

      {/* Game list */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        {BRAIN_GAMES.map(game => {
          const unlocked = isGameUnlocked(game.id, progress);
          const gameProgress = progress.gamesProgress[game.id];
          const screen = GAME_SCREEN_MAP[game.id];

          return (
            <GameCard
              key={game.id}
              testID={`brain-game-card-${game.id}`}
              icon={game.icon}
              title={t(game.titleKey, game.id)}
              description={t(game.descriptionKey, '')}
              stars={gameProgress?.bestStars ?? 0}
              isUnlocked={unlocked}
              accentColor={game.accentColor}
              onPress={
                unlocked && screen
                  ? () => navigation.navigate(screen as any, {level: 1} as any)
                  : undefined
              }
            />
          );
        })}
        <View style={styles.listBottom} />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#6366F1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerEmoji: {
    fontSize: 44,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginTop: 2,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  starIcon: {
    fontSize: 16,
  },
  starCount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E7FF',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listBottom: {
    height: 32,
  },
});
