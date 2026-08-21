import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeMatchingPair} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeMatcherBoardProps {
  readonly pairs: readonly ShapeMatchingPair[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function ShapeMatcherBoard({pairs, onComplete}: ShapeMatcherBoardProps) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shapesAudio.speak(
      'Match the same shapes together, even if they have different colors!',
    );
  }, []);

  const shuffledRights = React.useMemo(() => {
    return [...pairs].sort(() => 0.5 - Math.random());
  }, [pairs]);

  const handleTapLeft = (pair: ShapeMatchingPair) => {
    if (matchedIds.includes(pair.shapeId)) return;
    setSelectedLeftId(pair.shapeId);
    shapesAudio.playTone(480, 70);
    shapesAudio.speak(
      `Selected ${pair.shapeName}. Now find the matching ${pair.shapeName}!`,
    );
  };

  const handleTapRight = (pair: ShapeMatchingPair) => {
    if (matchedIds.includes(pair.shapeId) || !selectedLeftId) return;

    if (selectedLeftId === pair.shapeId) {
      const newMatches = [...matchedIds, pair.shapeId];
      setMatchedIds(newMatches);
      setSelectedLeftId(null);
      shapesAudio.playMatchSound();
      shapesAudio.speak(`Match! You matched the ${pair.shapeName}s!`);

      if (newMatches.length >= pairs.length) {
        shapesAudio.playCelebrationFanfare();
        shapesAudio.speak('Awesome! You matched all the shapes!');
        Animated.spring(celebrationAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      }
    } else {
      shapesAudio.playTone(260, 150);
      shapesAudio.speak('Not quite a match. Look closely at the shape!');
      setSelectedLeftId(null);
    }
  };

  const handleFinish = () => {
    onComplete(pairs.length, 3);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>
        Tap a shape on the left, then tap its match on the right!
      </Text>

      {/* Two Columns Grid */}
      <View style={styles.columnsRow}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Shapes</Text>
          {pairs.map(p => {
            const isMatched = matchedIds.includes(p.shapeId);
            const isSelected = selectedLeftId === p.shapeId;

            return (
              <Pressable
                key={`left_${p.id}`}
                accessibilityRole="button"
                accessibilityLabel={`${p.shapeName} on left`}
                disabled={isMatched}
                onPress={() => handleTapLeft(p)}
                style={[
                  styles.card,
                  {backgroundColor: p.leftColor},
                  isSelected && styles.selectedCard,
                  isMatched && styles.matchedCard,
                ]}>
                <Text style={styles.cardEmoji}>{p.leftEmoji}</Text>
                <Text style={styles.cardText}>{p.shapeName}</Text>
                {isMatched && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Matches</Text>
          {shuffledRights.map(p => {
            const isMatched = matchedIds.includes(p.shapeId);

            return (
              <Pressable
                key={`right_${p.id}`}
                accessibilityRole="button"
                accessibilityLabel={`${p.shapeName} on right`}
                disabled={isMatched}
                onPress={() => handleTapRight(p)}
                style={[
                  styles.card,
                  {backgroundColor: p.rightColor},
                  isMatched && styles.matchedCard,
                ]}>
                <Text style={styles.cardEmoji}>{p.rightEmoji}</Text>
                <Text style={styles.cardText}>{p.shapeName}</Text>
                {isMatched && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Completion Banner */}
      {matchedIds.length >= pairs.length && (
        <Animated.View
          style={[
            styles.celebrationBox,
            {transform: [{scale: celebrationAnim}]},
          ]}>
          <Text style={styles.celebrationEmoji}>🎉 🌟 👏</Text>
          <Text style={styles.celebrationTitle}>All Shapes Matched!</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Complete matching"
            onPress={handleFinish}
            style={styles.completeBtn}>
            <Text style={styles.completeBtnText}>Continue ➔</Text>
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
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    gap: 10,
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#374151',
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    padding: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#F59E0B',
    borderWidth: 3.5,
    transform: [{scale: 1.05}],
  },
  matchedCard: {
    opacity: 0.45,
    borderColor: '#10B981',
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  celebrationBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2.5,
    borderColor: '#10B981',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginTop: 8,
  },
  celebrationEmoji: {
    fontSize: 28,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  completeBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginTop: 4,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
