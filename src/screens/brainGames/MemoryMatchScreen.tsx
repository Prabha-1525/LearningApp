import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import {AppSafeAreaView, LearningHeader} from '@components';
import {MemoryCard} from '../../features/brainGames/presentation/components/MemoryCard';
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

const {width} = Dimensions.get('window');
const CARD_PADDING = 6;

export function MemoryMatchScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [levelIndex, setLevelIndex] = useState(0);
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const levelData = MEMORY_MATCH_LEVELS[levelIndex] ?? MEMORY_MATCH_LEVELS[0];
  const totalPairs = levelData.gridSize / 2;

  const initLevel = useCallback(() => {
    const symbols = [...levelData.symbols].slice(0, totalPairs);
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({
        id: `${symbol}-${idx}-${Date.now()}`,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIds([]);
    setMatchedCount(0);
    setMoves(0);
    setIsLocked(false);
  }, [levelData, totalPairs]);

  useEffect(() => {
    initLevel();
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [initLevel]);

  const handleCardPress = (id: string) => {
    if (isLocked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedIds, id];
    setCards(prev =>
      prev.map(c => (c.id === id ? {...c, isFlipped: true} : c)),
    );

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // match
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? {...c, isMatched: true}
                : c,
            ),
          );
          setFlippedIds([]);
          setIsLocked(false);
          setMatchedCount(m => {
            const next = m + 1;
            if (next === totalPairs) {
              // level complete
              const stars = moves + 1 <= totalPairs + 2 ? 3 : 2;
              recordGameCompletion('memory-match', stars);
              if (levelIndex < MEMORY_MATCH_LEVELS.length - 1) {
                setTimeout(() => setLevelIndex(i => i + 1), 600);
              } else {
                navigation.navigate('GameComplete', {
                  stars,
                  title: t(
                    'brainGames.games.memoryMatch.title',
                    'Memory Match',
                  ),
                  nextGameId: 'pattern-completer',
                });
              }
            }
            return next;
          });
        }, 400);
      } else {
        // not match
        lockTimerRef.current = setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? {...c, isFlipped: false}
                : c,
            ),
          );
          setFlippedIds([]);
          setIsLocked(false);
        }, 900);
      }
    } else {
      setFlippedIds(newFlipped);
    }
  };

  // card size based on grid
  const cols = Math.ceil(Math.sqrt(levelData.gridSize));
  const cardSize = Math.floor((width - 40 - cols * CARD_PADDING * 2) / cols);

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F5F3FF">
      <LearningHeader
        title={t('brainGames.games.memoryMatch.title', 'Memory Match')}
        emoji="🧠"
        accentColor="#7C3AED"
        titleColor="#7C3AED"
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
