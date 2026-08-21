import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ColorMatchingItem} from '../../domain/entities/drawingEntities';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

interface ColorMatchingGameProps {
  readonly items: readonly ColorMatchingItem[];
  readonly onFinish: (score: number, stars: number) => void;
}

export function ColorMatchingGame({items, onFinish}: ColorMatchingGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  const handleSelectOption = (opt: (typeof currentItem.options)[number]) => {
    if (selectedColorId !== null) return;
    setSelectedColorId(opt.colorId);

    const isCorrect = opt.colorId === currentItem.targetColorId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      drawingAudio.playSuccessChime();
      drawingAudio.speak(
        `Correct! A ${currentItem.objectName} is ${opt.name}!`,
      );

      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      drawingAudio.playTone(280, 150);
      drawingAudio.speak(
        `Try again! What color is a ${currentItem.objectName}?`,
      );
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedColorId === currentItem.targetColorId ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onFinish(finalScore, stars);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedColorId(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {items.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIdx && styles.dotActive,
              idx < currentIdx && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Target Object Card */}
      <Animated.View
        style={[styles.targetCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.targetEmoji}>{currentItem.objectEmoji}</Text>
        <Text style={styles.targetName}>{currentItem.objectName}</Text>
        <Text style={styles.promptText}>{currentItem.prompt}</Text>
      </Animated.View>

      {/* Color Options */}
      <View style={styles.optionsContainer}>
        {currentItem.options.map(opt => {
          const isSelected = selectedColorId === opt.colorId;
          const isCorrect = opt.colorId === currentItem.targetColorId;
          let borderStyle = styles.optionNormal;
          if (selectedColorId !== null) {
            if (isCorrect) borderStyle = styles.optionCorrect;
            else if (isSelected) borderStyle = styles.optionIncorrect;
          }

          return (
            <Pressable
              key={opt.colorId}
              accessibilityRole="button"
              accessibilityLabel={`Select color ${opt.name}`}
              disabled={selectedColorId !== null}
              onPress={() => handleSelectOption(opt)}
              style={[styles.optionCard, borderStyle]}>
              <View style={[styles.swatchCircle, {backgroundColor: opt.hex}]} />
              <Text style={styles.optionName}>{opt.name}</Text>
              {selectedColorId !== null && isCorrect && (
                <Text style={styles.checkIcon}>✅</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Next Step Button */}
      {selectedColorId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next matching question"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'See Results ⭐' : 'Next Match ➔'}
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
    paddingVertical: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  targetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  targetEmoji: {
    fontSize: 72,
  },
  targetName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  promptText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionNormal: {
    borderColor: '#E5E7EB',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  swatchCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  checkIcon: {
    fontSize: 18,
  },
  nextBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
