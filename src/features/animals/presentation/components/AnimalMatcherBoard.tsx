import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalMatchingPair} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalMatcherBoardProps {
  readonly pairs: readonly AnimalMatchingPair[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalMatcherBoard({
  pairs,
  onComplete,
}: AnimalMatcherBoardProps) {
  const [selectedLeftKey, setSelectedLeftKey] = useState<string | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animalsAudio.speak(
      'Match the animal on the left with its sound, habitat, food, or baby on the right!',
    );
  }, []);

  const shuffledRights = React.useMemo(() => {
    return [...pairs].sort(() => 0.5 - Math.random());
  }, [pairs]);

  const handleTapLeft = (pair: AnimalMatchingPair) => {
    if (matchedKeys.includes(pair.matchKey)) return;
    setSelectedLeftKey(pair.matchKey);
    animalsAudio.playTone(480, 70);
    animalsAudio.speak(`Selected ${pair.leftLabel}. Find its match!`);
  };

  const handleTapRight = (pair: AnimalMatchingPair) => {
    if (matchedKeys.includes(pair.matchKey) || !selectedLeftKey) return;

    if (selectedLeftKey === pair.matchKey) {
      const newMatches = [...matchedKeys, pair.matchKey];
      setMatchedKeys(newMatches);
      setSelectedLeftKey(null);
      animalsAudio.playMatchSound();
      animalsAudio.speak(
        `Great match! ${pair.leftLabel} matches with ${pair.rightLabel}!`,
      );

      if (newMatches.length >= pairs.length) {
        animalsAudio.playCelebrationFanfare();
        animalsAudio.speak('Superstar! You matched all the animal pairs!');
        Animated.spring(celebrationAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      }
    } else {
      animalsAudio.playTone(260, 150);
      animalsAudio.speak('Not quite a match. Look closely and try again!');
      setSelectedLeftKey(null);
    }
  };

  const handleFinish = () => {
    onComplete(pairs.length, 3);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>
        Tap an item on the left, then tap its match on the right!
      </Text>

      {/* Matching Columns */}
      <View style={styles.columnsRow}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={styles.colHeader}>Animals</Text>
          {pairs.map(p => {
            const isMatched = matchedKeys.includes(p.matchKey);
            const isSelected = selectedLeftKey === p.matchKey;

            return (
              <Pressable
                key={`left_${p.id}`}
                accessibilityRole="button"
                accessibilityLabel={p.leftLabel}
                disabled={isMatched}
                onPress={() => handleTapLeft(p)}
                style={[
                  styles.card,
                  isSelected && styles.selectedCard,
                  isMatched && styles.matchedCard,
                ]}>
                <Text style={styles.cardEmoji}>{p.leftEmoji}</Text>
                <Text style={styles.cardText}>{p.leftLabel}</Text>
                {isMatched && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={styles.colHeader}>Matches</Text>
          {shuffledRights.map(p => {
            const isMatched = matchedKeys.includes(p.matchKey);

            return (
              <Pressable
                key={`right_${p.id}`}
                accessibilityRole="button"
                accessibilityLabel={p.rightLabel}
                disabled={isMatched}
                onPress={() => handleTapRight(p)}
                style={[styles.card, isMatched && styles.matchedCard]}>
                <Text style={styles.cardEmoji}>{p.rightEmoji}</Text>
                <Text style={styles.cardText}>{p.rightLabel}</Text>
                {isMatched && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Completion Card */}
      {matchedKeys.length >= pairs.length && (
        <Animated.View
          style={[
            styles.celebrationBox,
            {transform: [{scale: celebrationAnim}]},
          ]}>
          <Text style={styles.celebrationEmoji}>🎉 🐾 ⭐</Text>
          <Text style={styles.celebrationTitle}>All Animals Matched!</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue"
            onPress={handleFinish}
            style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Continue ➔</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    gap: 10,
    alignItems: 'center',
  },
  colHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#374151',
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    backgroundColor: '#F0FDFA',
    borderWidth: 2.5,
    borderColor: '#14B8A6',
    padding: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#F59E0B',
    borderWidth: 3.5,
    backgroundColor: '#FEF3C7',
    transform: [{scale: 1.05}],
  },
  matchedCard: {
    opacity: 0.45,
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
  },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
  celebrationBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2.5,
    borderColor: '#10B981',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  celebrationEmoji: {
    fontSize: 28,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  continueBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginTop: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
