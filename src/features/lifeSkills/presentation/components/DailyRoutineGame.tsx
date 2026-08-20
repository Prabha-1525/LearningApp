import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MORNING_ROUTINE_STEPS} from '../../domain/catalog/lifeSkillsData';
import type {DailyRoutineStep} from '../../domain/entities/lifeSkillsEntities';

interface DailyRoutineGameProps {
  readonly onRoutineSequenced?: () => void;
  readonly onComplete?: (stars: number) => void;
}

export function DailyRoutineGame({
  onRoutineSequenced,
  onComplete,
}: DailyRoutineGameProps) {
  const {t} = useTranslation();
  const [placedStepIds, setPlacedStepIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [wrongTappedId, setWrongTappedId] = useState<string | null>(null);

  // Remaining pool
  const remainingSteps = MORNING_ROUTINE_STEPS.filter(
    s => !placedStepIds.includes(s.id),
  );

  const nextExpectedStep = MORNING_ROUTINE_STEPS[placedStepIds.length];

  const handleSelectStep = (step: DailyRoutineStep) => {
    if (isSuccess || !nextExpectedStep) {
      return;
    }

    if (step.id === nextExpectedStep.id) {
      const nextPlaced = [...placedStepIds, step.id];
      setPlacedStepIds(nextPlaced);
      setWrongTappedId(null);

      if (nextPlaced.length === MORNING_ROUTINE_STEPS.length) {
        setIsSuccess(true);
        onRoutineSequenced?.();
        onComplete?.(3);
      }
    } else {
      setWrongTappedId(step.id);
      setTimeout(() => {
        setWrongTappedId(null);
      }, 1000);
    }
  };

  const handleReset = () => {
    setPlacedStepIds([]);
    setIsSuccess(false);
    setWrongTappedId(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Main Board */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {t('lifeSkills.routine.instruction', 'Arrange Your Morning Routine!')}
        </Text>
        <Text style={styles.subtitle}>
          Tap the steps below in the correct order from morning to school time.
        </Text>

        {/* 6 Ordered Slots */}
        <View style={styles.timeline}>
          {MORNING_ROUTINE_STEPS.map((step, idx) => {
            const isPlaced = placedStepIds.includes(step.id);
            const isNext = placedStepIds.length === idx;

            return (
              <View
                key={step.id}
                style={[
                  styles.slotRow,
                  isPlaced && styles.slotRowFilled,
                  isNext && styles.slotRowNext,
                ]}>
                <View style={styles.slotNumberBadge}>
                  <Text style={styles.slotNumberText}>{idx + 1}</Text>
                </View>

                {isPlaced ? (
                  <View style={styles.filledContent}>
                    <Text style={styles.slotEmoji}>{step.emoji}</Text>
                    <Text style={styles.slotTitle}>
                      {t(step.titleKey, step.id)}
                    </Text>
                    <Text style={styles.timeBadge}>{step.timeHint}</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlotContent}>
                    <Text style={styles.emptySlotText}>
                      {isNext
                        ? '👉 Tap step #' + (idx + 1)
                        : 'Step #' + (idx + 1)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Remaining Step Cards to pick from */}
        {!isSuccess && remainingSteps.length > 0 && (
          <View style={styles.poolSection}>
            <Text style={styles.poolLabel}>
              👇 Choose the next routine step:
            </Text>
            <View style={styles.poolGrid}>
              {remainingSteps.map(step => {
                const isWrong = wrongTappedId === step.id;
                return (
                  <Pressable
                    key={step.id}
                    accessibilityRole="button"
                    onPress={() => handleSelectStep(step)}
                    style={[styles.poolBtn, isWrong && styles.poolBtnWrong]}>
                    <Text style={styles.poolEmoji}>{step.emoji}</Text>
                    <Text style={styles.poolBtnText} numberOfLines={2}>
                      {t(step.titleKey, step.id)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <View style={styles.successBanner}>
            <Text style={styles.successEmoji}>🌟 🎒 ⏰ ✨</Text>
            <Text style={styles.successTitle}>
              Super Routine Master! Your morning is organized and ready for
              school!
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleReset}
              style={styles.replayBtn}>
              <Text style={styles.replayBtnText}>
                Practice Routine Again 🔄
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: '#FDE68A',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  timeline: {
    gap: 8,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  slotRowFilled: {
    backgroundColor: '#ECFDF5',
    borderColor: '#86EFAC',
  },
  slotRowNext: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  slotNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  filledContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotEmoji: {
    fontSize: 20,
  },
  slotTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  timeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  emptySlotContent: {
    flex: 1,
  },
  emptySlotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  poolSection: {
    gap: 8,
    marginTop: 4,
  },
  poolLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    textAlign: 'center',
  },
  poolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  poolBtn: {
    width: '48%',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
    gap: 4,
  },
  poolBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  poolEmoji: {
    fontSize: 24,
  },
  poolBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
    marginTop: 6,
  },
  successEmoji: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
  },
  replayBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  replayBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
