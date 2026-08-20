import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {GKPracticeActivity} from '../../domain/entities/gkEntities';

interface GKInteractivePracticeProps {
  readonly practice: GKPracticeActivity;
  readonly accentColor: string;
  readonly onSolved: () => void;
}

export function GKInteractivePractice({
  practice,
  accentColor,
  onSolved,
}: GKInteractivePracticeProps) {
  const {t} = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const handleSelect = (choice: GKPracticeActivity['choices'][number]) => {
    setSelectedId(choice.id);
    if (choice.isCorrect) {
      setIsCorrect(true);
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(onSolved, 800);
      });
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Activity Prompt */}
      <View style={[styles.promptBox, {borderColor: accentColor}]}>
        <Text style={styles.promptEmoji}>🎯</Text>
        <Text style={styles.promptText}>
          {t(practice.promptKey, 'Tap the matching item!')}
        </Text>
      </View>

      {/* Target hint box */}
      <Animated.View
        style={[
          styles.targetBadge,
          {
            backgroundColor: `${accentColor}1A`,
            transform: [{scale: pulseAnim}],
          },
        ]}>
        <Text style={styles.targetEmoji}>{practice.targetEmoji}</Text>
      </Animated.View>

      {/* Options grid */}
      <View style={styles.choicesGrid}>
        {practice.choices.map(choice => {
          const isSelected = selectedId === choice.id;
          const showSuccess = isSelected && isCorrect === true;
          const showError = isSelected && isCorrect === false;

          return (
            <Pressable
              key={choice.id}
              accessibilityRole="button"
              accessibilityLabel={t(choice.labelKey, choice.emoji)}
              onPress={() => handleSelect(choice)}
              style={[
                styles.choiceCard,
                isSelected && styles.choiceSelected,
                showSuccess && styles.choiceSuccess,
                showError && styles.choiceError,
              ]}>
              <Text style={styles.choiceEmoji}>{choice.emoji}</Text>
              <Text style={styles.choiceLabel} numberOfLines={1}>
                {t(choice.labelKey, '')}
              </Text>
              {showSuccess && <Text style={styles.feedbackEmoji}>🌟</Text>}
            </Pressable>
          );
        })}
      </View>

      {isCorrect === false && (
        <View style={styles.retryHint}>
          <Text style={styles.retryText}>
            {t(
              'generalKnowledge.practiceTryAgain',
              'Good try! Look closely and tap again! ✨',
            )}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
    width: '100%',
  },
  promptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  promptEmoji: {
    fontSize: 20,
  },
  promptText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  targetBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  targetEmoji: {
    fontSize: 48,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  choiceCard: {
    flex: 1,
    minWidth: '28%',
    maxWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  choiceSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  choiceSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  choiceError: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  choiceEmoji: {
    fontSize: 34,
  },
  choiceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
  },
  feedbackEmoji: {
    fontSize: 16,
    position: 'absolute',
    top: 6,
    right: 6,
  },
  retryHint: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
  },
});
