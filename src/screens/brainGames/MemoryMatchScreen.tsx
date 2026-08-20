import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {MemoryCard} from '../../features/brainGames/presentation/components/MemoryCard';
import {GameHeader} from '../../features/brainGames/presentation/components/GameHeader';
import {MEMORY_MATCH_LEVELS} from '../../features/brainGames/domain/catalog/memoryMatchData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<BrainGamesStackParamList, 'MemoryMatch'>;

type CardState = {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildCards(pairs: readonly string[]): CardState[] {
  const doubled = pairs.flatMap(p => [p, p]);
  return shuffleArray(doubled).map((symbol, i) => ({
    id: `card-${i}-${symbol}`,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

const {width} = Dimensions.get('window');
const CARD_PADDING = 8;

export function MemoryMatchScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [currentLevel, setCurrentLevel] = useState(0);
  const levelData = MEMORY_MATCH_LEVELS[currentLevel] ?? MEMORY_MATCH_LEVELS[0];

  const [cards, setCards] = useState<CardState[]>(() =>
    buildCards(levelData.pairs),
  );
  const [_flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const isChecking = useRef(false);

  const totalPairs = levelData.pairs.length;

  useEffect(() => {
    setCards(buildCards(levelData.pairs));
    setFlippedIds([]);
    setMatchedCount(0);
    setMoves(0);
  }, [currentLevel, levelData.pairs]);

  const handleCardPress = useCallback(
    (cardId: string) => {
      if (isChecking.current) {
        return;
      }
      setCards(prev => {
        const card = prev.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) {
          return prev;
        }
        return prev.map(c => (c.id === cardId ? {...c, isFlipped: true} : c));
      });
      setFlippedIds(prev => {
        const newFlipped = [...prev, cardId];
        if (newFlipped.length === 2) {
          isChecking.current = true;
          setMoves(m => m + 1);
          setTimeout(() => {
            setCards(prevCards => {
              const [a, b] = newFlipped.map(id =>
                prevCards.find(c => c.id === id),
              );
              if (a && b && a.symbol === b.symbol) {
                const updated = prevCards.map(c =>
                  newFlipped.includes(c.id)
                    ? {...c, isMatched: true, isFlipped: true}
                    : c,
                );
                setMatchedCount(mc => {
                  const next = mc + 1;
                  if (next === totalPairs) {
                    // Level complete
                    setTimeout(() => {
                      const stars =
                        moves < totalPairs * 2
                          ? 3
                          : moves < totalPairs * 3
                          ? 2
                          : 1;
                      recordGameCompletion('memory-match', stars);
                      if (currentLevel < MEMORY_MATCH_LEVELS.length - 1) {
                        setCurrentLevel(l => l + 1);
                      } else {
                        navigation.navigate('GameComplete', {
                          gameId: 'memory-match',
                          stars,
                          nextGame: 'MatchingPairs',
                        });
                      }
                    }, 600);
                  }
                  return next;
                });
                return updated;
              }
              // No match — flip back
              return prevCards.map(c =>
                newFlipped.includes(c.id) && !c.isMatched
                  ? {...c, isFlipped: false}
                  : c,
              );
            });
            setFlippedIds([]);
            isChecking.current = false;
          }, 900);
          return [];
        }
        return newFlipped;
      });
    },
    [currentLevel, moves, navigation, totalPairs],
  );

  // card size based on grid
  const cols = Math.ceil(Math.sqrt(levelData.gridSize));
  const cardSize = Math.floor((width - 40 - cols * CARD_PADDING * 2) / cols);

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F5F3FF">
      <GameHeader
        title={t('brainGames.games.memoryMatch.title', 'Memory Match')}
        emoji="🧠"
        accentColor="#7C3AED"
        score={matchedCount}
        totalScore={totalPairs}
        onBack={() => navigation.navigate('Home')}
      />

      {/* Level indicator */}
      <View style={styles.levelRow}>
        <Text style={styles.levelText}>
          {t('brainGames.level', {
            level: levelData.level,
            defaultValue: `Level ${levelData.level}`,
          })}
        </Text>
        <Text style={styles.movesText}>
          {t('brainGames.moves', {
            count: moves,
            defaultValue: `${moves} moves`,
          })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.board}>
        <View style={[styles.grid, {width: width - 32}]}>
          {cards.map(card => (
            <MemoryCard
              key={card.id}
              symbol={card.symbol}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              accentColor="#7C3AED"
              size={cardSize}
              onPress={() => handleCardPress(card.id)}
            />
          ))}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5B21B6',
  },
  movesText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  board: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
