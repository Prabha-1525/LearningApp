import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SEQUENCING_STORIES} from '../../domain/catalog/codingData';
import type {
  SequencingStep,
  SequencingStory,
} from '../../domain/entities/codingEntities';

interface SequencingGameProps {
  readonly onComplete?: (stars: number) => void;
}

export function SequencingGame({onComplete}: SequencingGameProps) {
  const {t} = useTranslation();
  const [storyIndex, setStoryIndex] = useState<number>(0);
  const [placedStepIds, setPlacedStepIds] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const story: SequencingStory =
    SEQUENCING_STORIES[storyIndex] ?? SEQUENCING_STORIES[0]!;

  const handleSelectStep = (stepId: string) => {
    if (placedStepIds.includes(stepId) || isCorrect === true) {
      return;
    }
    const nextPlaced = [...placedStepIds, stepId];
    setPlacedStepIds(nextPlaced);
    setIsCorrect(null);

    // Auto-check if 4 steps are placed
    if (nextPlaced.length === story.correctOrder.length) {
      const match = nextPlaced.every(
        (id, idx) => id === story.correctOrder[idx],
      );
      if (match) {
        setIsCorrect(true);
        onComplete?.(3);
      } else {
        setIsCorrect(false);
      }
    }
  };

  const handleRemovePlacedStep = (idx: number) => {
    if (isCorrect === true) {
      return;
    }
    setPlacedStepIds(prev => prev.filter((_, i) => i !== idx));
    setIsCorrect(null);
  };

  const handleResetSlots = () => {
    setPlacedStepIds([]);
    setIsCorrect(null);
  };

  const handleNextStory = () => {
    setStoryIndex(i => (i + 1) % SEQUENCING_STORIES.length);
    setPlacedStepIds([]);
    setIsCorrect(null);
  };

  // Available cards that haven't been placed in slots yet
  const availableSteps = story.steps.filter(s => !placedStepIds.includes(s.id));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Story Selector Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyStrip}>
        {SEQUENCING_STORIES.map((s, idx) => {
          const isSelected = idx === storyIndex;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              onPress={() => {
                setStoryIndex(idx);
                setPlacedStepIds([]);
                setIsCorrect(null);
              }}
              style={[
                styles.storyPill,
                isSelected && styles.storyPillSelected,
              ]}>
              <Text
                style={[
                  styles.storyPillText,
                  isSelected && styles.storyPillTextSelected,
                ]}>
                Story {idx + 1}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Story Prompt Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.storyTitle}>
            📖 {t(story.titleKey, 'Arrange in Correct Order')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleResetSlots}
            style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>🔄 Reset</Text>
          </Pressable>
        </View>

        <Text style={styles.instructionText}>
          {t(
            'coding.sequencing.instruction',
            'Tap the cards below in the order they happen (1 ➔ 2 ➔ 3 ➔ 4):',
          )}
        </Text>

        {/* 4 Ordered Slots */}
        <View style={styles.slotsRow}>
          {Array.from({length: story.correctOrder.length}).map((_, idx) => {
            const stepId = placedStepIds[idx];
            const stepObj = story.steps.find(s => s.id === stepId);

            return (
              <Pressable
                key={`slot-${idx}`}
                accessibilityRole="button"
                onPress={() => stepId && handleRemovePlacedStep(idx)}
                style={[
                  styles.slotBox,
                  stepObj && styles.slotBoxFilled,
                  isCorrect === true && styles.slotBoxCorrect,
                  isCorrect === false && styles.slotBoxWrong,
                ]}>
                <View style={styles.slotBadge}>
                  <Text style={styles.slotBadgeText}>Step {idx + 1}</Text>
                </View>
                {stepObj ? (
                  <View style={styles.slotContent}>
                    <Text style={styles.slotEmoji}>{stepObj.icon}</Text>
                    <Text style={styles.slotLabel} numberOfLines={2}>
                      {t(stepObj.textKey, '')}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.slotPlaceholder}>➕ Tap Card</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Feedback Banner */}
        {isCorrect === true && (
          <View style={styles.feedbackSuccess}>
            <Text style={styles.feedbackSuccessText}>
              🎉 Wonderful! You sequenced the steps in perfect order!
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextStory}
              style={styles.nextStoryBtn}>
              <Text style={styles.nextStoryBtnText}>Next Story ❯</Text>
            </Pressable>
          </View>
        )}

        {isCorrect === false && (
          <View style={styles.feedbackWrong}>
            <Text style={styles.feedbackWrongText}>
              ❌ Oops! Something happened out of order. Tap a card to replace
              it!
            </Text>
          </View>
        )}

        {/* Available Shuffled Step Cards */}
        <View style={styles.availableSection}>
          <Text style={styles.availableSectionTitle}>
            🃏 Available Steps (Tap to place):
          </Text>
          <View style={styles.cardsGrid}>
            {availableSteps.length === 0 ? (
              <Text style={styles.allPlacedText}>
                All steps placed in the sequence above! 👆
              </Text>
            ) : (
              availableSteps.map((step: SequencingStep) => (
                <Pressable
                  key={step.id}
                  accessibilityRole="button"
                  onPress={() => handleSelectStep(step.id)}
                  style={({pressed}) => [
                    styles.stepCard,
                    pressed && styles.stepCardPressed,
                  ]}>
                  <Text style={styles.stepCardIcon}>{step.icon}</Text>
                  <Text style={styles.stepCardText}>{t(step.textKey, '')}</Text>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  storyStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  storyPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  storyPillSelected: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  storyPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  storyPillTextSelected: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  slotBox: {
    flex: 1,
    minHeight: 110,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    alignItems: 'center',
    padding: 6,
    justifyContent: 'space-between',
  },
  slotBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  slotBoxCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  slotBoxWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  slotBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slotBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#475569',
  },
  slotContent: {
    alignItems: 'center',
    gap: 2,
  },
  slotEmoji: {
    fontSize: 26,
  },
  slotLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  slotPlaceholder: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginVertical: 'auto',
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
  },
  feedbackSuccessText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    textAlign: 'center',
  },
  nextStoryBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  nextStoryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  feedbackWrong: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  feedbackWrongText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
  },
  availableSection: {
    gap: 10,
    marginTop: 4,
  },
  availableSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  allPlacedText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#94A3B8',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  stepCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCardPressed: {
    transform: [{scale: 0.96}],
    backgroundColor: '#F1F5F9',
  },
  stepCardIcon: {
    fontSize: 28,
  },
  stepCardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
});
