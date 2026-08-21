import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeMemoryCard} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeMemoryGameProps {
  readonly cardDeck: readonly ShapeMemoryCard[];
  readonly onFinish: (stars: number) => void;
}

export function ShapeMemoryGame({cardDeck, onFinish}: ShapeMemoryGameProps) {
  const [cards, setCards] = useState<ShapeMemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shuffled = [...cardDeck].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedKeys([]);
    shapesAudio.speak(
      'Shape Memory Match! Tap two cards to find matching shapes!',
    );
  }, [cardDeck]);

  const handleTapCard = (index: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;

    const card = cards[index];
    if (!card || matchedKeys.includes(card.matchKey)) return;

    shapesAudio.playTone(520, 60);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const firstIdx = newFlipped[0]!;
      const secondIdx = newFlipped[1]!;
      const firstCard = cards[firstIdx]!;
      const secondCard = cards[secondIdx]!;

      if (firstCard.matchKey === secondCard.matchKey) {
        shapesAudio.playMatchSound();
        shapesAudio.speak(`Match! You found the ${firstCard.name}!`);
        const updatedMatches = [...matchedKeys, firstCard.matchKey];
        setMatchedKeys(updatedMatches);
        setFlippedIndices([]);

        if (updatedMatches.length * 2 >= cards.length) {
          shapesAudio.playCelebrationFanfare();
          shapesAudio.speak('Amazing! You cleared the entire memory board!');
          Animated.spring(celebrationAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      } else {
        shapesAudio.playTone(280, 120);
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>
        Found Matches: {matchedKeys.length} / {cards.length / 2}
      </Text>

      {/* Memory Cards Grid */}
      <View style={styles.grid}>
        {cards.map((card, idx) => {
          const isFlipped =
            flippedIndices.includes(idx) || matchedKeys.includes(card.matchKey);
          const isMatched = matchedKeys.includes(card.matchKey);

          return (
            <Pressable
              key={`${card.id}_${idx}`}
              accessibilityRole="button"
              accessibilityLabel={isFlipped ? card.name : `Card ${idx + 1}`}
              disabled={isMatched}
              onPress={() => handleTapCard(idx)}
              style={[
                styles.card,
                isFlipped ? styles.cardFlipped : styles.cardCovered,
                isMatched && styles.cardMatched,
              ]}>
              {isFlipped ? (
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>{card.emoji}</Text>
                  <Text style={styles.cardName}>{card.name}</Text>
                </View>
              ) : (
                <Text style={styles.coverEmoji}>❓</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Win Banner */}
      {matchedKeys.length * 2 >= cards.length && (
        <Animated.View
          style={[
            styles.celebrationBox,
            {transform: [{scale: celebrationAnim}]},
          ]}>
          <Text style={styles.celebrationEmoji}>🎉 🧠 🌟</Text>
          <Text style={styles.celebrationTitle}>Memory Master Complete!</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue"
            onPress={() => onFinish(3)}
            style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Claim 3 Stars ⭐</Text>
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
    fontWeight: '800',
    color: '#4B5563',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: 76,
    height: 96,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCovered: {
    backgroundColor: '#6366F1',
    borderColor: '#4338CA',
  },
  cardFlipped: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
  },
  cardMatched: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    opacity: 0.85,
  },
  coverEmoji: {
    fontSize: 32,
  },
  cardContent: {
    alignItems: 'center',
    gap: 4,
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F2937',
  },
  celebrationBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2.5,
    borderColor: '#10B981',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  celebrationEmoji: {
    fontSize: 26,
  },
  celebrationTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#059669',
  },
  continueBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 16,
    marginTop: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
