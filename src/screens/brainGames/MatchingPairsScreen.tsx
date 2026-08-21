import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {AppSafeAreaView, LearningHeader} from '@components';
import {MATCHING_LEVELS} from '../../features/brainGames/domain/catalog/matchingData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<BrainGamesStackParamList, 'MatchingPairs'>;

export function MatchingPairsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [currentLevel, setCurrentLevel] = useState(0);
  const levelData = MATCHING_LEVELS[currentLevel] ?? MATCHING_LEVELS[0];

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [score, setScore] = useState(0);

  const shakeValue = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shakeValue.value}],
  }));

  const handleLeft = useCallback(
    (pairId: string) => {
      if (matchedIds.includes(pairId)) {
        return;
      }
      setSelectedLeft(pairId);
      // Auto-check if right already selected
      if (selectedRight !== null) {
        if (selectedRight === pairId) {
          setMatchedIds(prev => [...prev, pairId]);
          setScore(s => s + 1);
          setSelectedLeft(null);
          setSelectedRight(null);
          if (matchedIds.length + 1 === levelData.pairs.length) {
            setTimeout(() => {
              const stars = 3;
              recordGameCompletion('matching-pairs', stars);
              if (currentLevel < MATCHING_LEVELS.length - 1) {
                setCurrentLevel(l => l + 1);
                setMatchedIds([]);
                setScore(0);
              } else {
                navigation.navigate('GameComplete', {
                  gameId: 'matching-pairs',
                  stars,
                  nextGame: 'PatternCompleter',
                });
              }
            }, 500);
          }
        } else {
          // Wrong
          shakeValue.value = withSequence(
            withTiming(10, {duration: 80}),
            withTiming(-10, {duration: 80}),
            withTiming(0, {duration: 80}),
          );
          setWrongFlash(true);
          setTimeout(() => {
            setWrongFlash(false);
            setSelectedLeft(null);
            setSelectedRight(null);
          }, 400);
        }
      }
    },
    [
      currentLevel,
      levelData.pairs.length,
      matchedIds,
      navigation,
      selectedRight,
      shakeValue,
    ],
  );

  const handleRight = useCallback(
    (pairId: string) => {
      if (matchedIds.includes(pairId)) {
        return;
      }
      setSelectedRight(pairId);
      if (selectedLeft !== null) {
        if (selectedLeft === pairId) {
          setMatchedIds(prev => [...prev, pairId]);
          setScore(s => s + 1);
          setSelectedLeft(null);
          setSelectedRight(null);
          if (matchedIds.length + 1 === levelData.pairs.length) {
            setTimeout(() => {
              const stars = 3;
              recordGameCompletion('matching-pairs', stars);
              if (currentLevel < MATCHING_LEVELS.length - 1) {
                setCurrentLevel(l => l + 1);
                setMatchedIds([]);
                setScore(0);
              } else {
                navigation.navigate('GameComplete', {
                  gameId: 'matching-pairs',
                  stars,
                  nextGame: 'PatternCompleter',
                });
              }
            }, 500);
          }
        } else {
          shakeValue.value = withSequence(
            withTiming(10, {duration: 80}),
            withTiming(-10, {duration: 80}),
            withTiming(0, {duration: 80}),
          );
          setWrongFlash(true);
          setTimeout(() => {
            setWrongFlash(false);
            setSelectedLeft(null);
            setSelectedRight(null);
          }, 400);
        }
      }
    },
    [
      currentLevel,
      levelData.pairs.length,
      matchedIds,
      navigation,
      selectedLeft,
      shakeValue,
    ],
  );

  const rightItems = React.useMemo(
    () => [...levelData.pairs].sort(() => Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLevel],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0FDFA">
      <LearningHeader
        title={t('brainGames.games.matchingPairs.title', 'Matching Pairs')}
        emoji="🔗"
        accentColor="#0F8B8D"
        titleColor="#0F8B8D"
        score={score}
        totalScore={levelData.pairs.length}
        onBack={() => navigation.navigate('Home')}
      />

      <View style={styles.levelRow}>
        <Text style={styles.levelText}>
          {t('brainGames.level', {
            level: levelData.level,
            defaultValue: `Level ${levelData.level}`,
          })}
        </Text>
        <Text style={styles.hint}>
          {t('brainGames.matchingPairs.hint', 'Tap one from each side')}
        </Text>
      </View>

      <Animated.View style={[styles.board, shakeStyle]}>
        <ScrollView contentContainerStyle={styles.columns}>
          {/* Left column */}
          <View style={styles.column}>
            {levelData.pairs.map(pair => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedLeft === pair.id;
              return (
                <Pressable
                  key={`left-${pair.id}`}
                  testID={`left-${pair.id}`}
                  style={[
                    styles.matchCard,
                    isMatched && styles.matchedCard,
                    isSelected && styles.selectedCard,
                    wrongFlash && isSelected && styles.wrongCard,
                  ]}
                  onPress={() => handleLeft(pair.id)}>
                  <Text style={styles.matchEmoji}>{pair.left}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Middle arrows */}
          <View style={styles.arrows}>
            {levelData.pairs.map(pair => (
              <View key={`arrow-${pair.id}`} style={styles.arrowSlot}>
                {matchedIds.includes(pair.id) ? (
                  <Text style={styles.checkArrow}>✓</Text>
                ) : (
                  <Text style={styles.arrowText}>↔</Text>
                )}
              </View>
            ))}
          </View>

          {/* Right column */}
          <View style={styles.column}>
            {rightItems.map(pair => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedRight === pair.id;
              return (
                <Pressable
                  key={`right-${pair.id}`}
                  testID={`right-${pair.id}`}
                  style={[
                    styles.matchCard,
                    isMatched && styles.matchedCard,
                    isSelected && styles.selectedCard,
                    wrongFlash && isSelected && styles.wrongCard,
                  ]}
                  onPress={() => handleRight(pair.id)}>
                  <Text style={styles.matchEmoji}>{pair.right}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
  },
  hint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  board: {
    flex: 1,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
  },
  column: {
    gap: 14,
    flex: 1,
    alignItems: 'center',
  },
  arrows: {
    gap: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowSlot: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#CBD5E1',
  },
  checkArrow: {
    fontSize: 22,
    color: '#34D399',
    fontWeight: '900',
  },
  matchCard: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#CCFBF1',
    shadowColor: '#0F8B8D',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  matchedCard: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  selectedCard: {
    borderColor: '#0F8B8D',
    backgroundColor: '#CCFBF1',
    transform: [{scale: 1.08}],
  },
  wrongCard: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  matchEmoji: {
    fontSize: 32,
  },
});
