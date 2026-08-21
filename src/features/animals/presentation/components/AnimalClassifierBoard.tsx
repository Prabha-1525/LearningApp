import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalClassificationItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalClassifierBoardProps {
  readonly items: readonly AnimalClassificationItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalClassifierBoard({
  items,
  onComplete,
}: AnimalClassifierBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    setSelectedIds([]);
    animalsAudio.speak(currentItem.promptAudio);
  }, [currentIdx, currentItem]);

  const targetCount = currentItem.options.filter(o => o.matches).length;

  const handleToggleOption = (id: string, matches: boolean) => {
    if (selectedIds.includes(id)) return;

    if (matches) {
      const next = [...selectedIds, id];
      setSelectedIds(next);
      animalsAudio.playMatchSound();
      animalsAudio.speak('Yes! That animal belongs to this group!');

      if (next.length >= targetCount) {
        setScore(prev => prev + 1);
        animalsAudio.playSuccessChime();
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      animalsAudio.playTone(260, 140);
      animalsAudio.speak(
        'Look carefully! That animal does not fit this category.',
      );
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (selectedIds.length >= targetCount ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Classification Prompt */}
      <Animated.View
        style={[styles.promptCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.promptIndex}>
          Category {currentIdx + 1} of {items.length}
        </Text>
        <Text style={styles.promptText}>{currentItem.question}</Text>
        <Text style={styles.foundText}>
          Found: {selectedIds.length} / {targetCount}
        </Text>
      </Animated.View>

      {/* Options Grid */}
      <View style={styles.grid}>
        {currentItem.options.map(opt => {
          const isSelected = selectedIds.includes(opt.id);

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityLabel={opt.name}
              onPress={() => handleToggleOption(opt.id, opt.matches)}
              style={[
                styles.animalCard,
                isSelected && styles.animalCardSelected,
              ]}>
              <Text style={styles.animalEmoji}>{opt.emoji}</Text>
              <Text style={styles.animalName}>{opt.name}</Text>
              {isSelected && <Text style={styles.checkBadge}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedIds.length >= targetCount && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next category"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Classification 🌟' : 'Next Category ➔'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  promptCard: {
    width: '100%',
    backgroundColor: '#EEF2FF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#6366F1',
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  promptIndex: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#312E81',
    textAlign: 'center',
  },
  foundText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4338CA',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  animalCard: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  animalCardSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 3.5,
    transform: [{scale: 1.05}],
  },
  animalEmoji: {
    fontSize: 40,
  },
  animalName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 6,
    fontSize: 16,
    fontWeight: '900',
    color: '#059669',
  },
  nextBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
