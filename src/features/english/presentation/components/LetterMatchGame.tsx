import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {LetterMatchPair} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface LetterMatchGameProps {
  readonly pairs: readonly LetterMatchPair[];
  readonly onCompleted: (stars: number) => void;
}

export function LetterMatchGame({pairs, onCompleted}: LetterMatchGameProps) {
  const {t} = useTranslation();
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [selectedLower, setSelectedLower] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const currentPair = pairs[currentPairIdx];
  const isLast = currentPairIdx === pairs.length - 1;

  const options = React.useMemo(() => {
    if (!currentPair) return [];
    const opts = [currentPair.lower, ...currentPair.distractors];
    // deterministic shuffle based on upper character code
    return [...opts].sort(
      (a, b) =>
        ((a.charCodeAt(0) * 3 + currentPairIdx) % 7) -
        ((b.charCodeAt(0) * 3 + currentPairIdx) % 7),
    );
  }, [currentPair, currentPairIdx]);

  const handleSelectOption = (lowerChoice: string) => {
    if (selectedLower !== null) return;
    setSelectedLower(lowerChoice);

    const correct = lowerChoice === currentPair.lower;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      englishAudio.playSuccessChime();
      englishAudio.speak(
        `Correct! Capital ${currentPair.upper} matches small ${lowerChoice}!`,
      );
    } else {
      englishAudio.playTryAgainTone();
      englishAudio.speak(
        `Try again! Capital ${currentPair.upper} matches small ${currentPair.lower}.`,
      );
    }

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (isCorrect ? 0 : 0);
      const total = pairs.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;
      onCompleted(stars);
    } else {
      setCurrentPairIdx(prev => prev + 1);
      setSelectedLower(null);
      setIsCorrect(null);
    }
  };

  if (!currentPair) return null;

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {pairs.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentPairIdx && styles.dotActive,
              idx < currentPairIdx && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Hero Uppercase Target */}
      <Animated.View
        style={[styles.targetCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.targetPrompt}>
          {t('english.matchLowercasePrompt', 'Find the lowercase letter for:')}
        </Text>
        <View style={styles.targetLetterBox}>
          <Text style={styles.targetLetter}>{currentPair.upper}</Text>
        </View>
      </Animated.View>

      {/* Options Grid */}
      <View style={styles.optionsGrid}>
        {options.map(opt => {
          const isSelected = selectedLower === opt;
          const isThisCorrect = opt === currentPair.lower;
          const showSuccess = selectedLower !== null && isThisCorrect;
          const showWrong = isSelected && !isThisCorrect;

          return (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityLabel={`Option lowercase ${opt}`}
              disabled={selectedLower !== null}
              onPress={() => handleSelectOption(opt)}
              style={[
                styles.optionTile,
                isSelected && styles.optionSelected,
                showSuccess && styles.optionSuccess,
                showWrong && styles.optionWrong,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  showSuccess && styles.textSuccess,
                  showWrong && styles.textWrong,
                ]}>
                {opt}
              </Text>
              {showSuccess && <Text style={styles.badgeEmoji}>✅</Text>}
              {showWrong && <Text style={styles.badgeEmoji}>❌</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Feedback / Next Action */}
      {selectedLower !== null && (
        <View
          style={[
            styles.feedbackCard,
            isCorrect ? styles.feedbackSuccess : styles.feedbackWrong,
          ]}>
          <Text style={styles.feedbackText}>
            {isCorrect
              ? `🌟 Great! ${currentPair.upper} ➔ ${currentPair.lower}`
              : `💡 Almost! ${currentPair.upper} ➔ ${currentPair.lower}`}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {isLast ? 'Complete Activity ⭐' : 'Next Pair ➔'}
            </Text>
          </Pressable>
        </View>
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
    backgroundColor: '#8B5CF6',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  targetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  targetPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  targetLetterBox: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: '#F5F3FF',
    borderWidth: 2,
    borderColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetLetter: {
    fontSize: 56,
    fontWeight: '900',
    color: '#7C3AED',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  optionTile: {
    width: '45%',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  optionSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1F2937',
  },
  textSuccess: {
    color: '#065F46',
  },
  textWrong: {
    color: '#991B1B',
  },
  badgeEmoji: {
    fontSize: 20,
  },
  feedbackCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  feedbackSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  feedbackWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  nextBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
