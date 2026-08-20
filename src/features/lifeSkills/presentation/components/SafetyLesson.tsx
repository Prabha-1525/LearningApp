import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SAFETY_TIPS_LIST} from '../../domain/catalog/lifeSkillsData';

interface SafetyLessonProps {
  readonly onComplete?: (stars: number) => void;
}

export function SafetyLesson({onComplete}: SafetyLessonProps) {
  const {t} = useTranslation();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [reviewedIds, setReviewedIds] = useState<string[]>([
    SAFETY_TIPS_LIST[0]?.id ?? 'st-1',
  ]);

  const current = SAFETY_TIPS_LIST[selectedIdx] ?? SAFETY_TIPS_LIST[0]!;

  const handleSelectTip = (idx: number) => {
    setSelectedIdx(idx);
    const tip = SAFETY_TIPS_LIST[idx];
    if (tip && !reviewedIds.includes(tip.id)) {
      const next = [...reviewedIds, tip.id];
      setReviewedIds(next);
      if (next.length >= SAFETY_TIPS_LIST.length) {
        onComplete?.(3);
      }
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {SAFETY_TIPS_LIST.map((tip, idx) => {
          const isSelected = idx === selectedIdx;
          const isDone = reviewedIds.includes(tip.id);

          return (
            <Pressable
              key={tip.id}
              accessibilityRole="button"
              onPress={() => handleSelectTip(idx)}
              style={[
                styles.pill,
                isSelected && {
                  backgroundColor: tip.color,
                  borderColor: tip.color,
                },
              ]}>
              <Text style={styles.pillEmoji}>{tip.emoji}</Text>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                {t(tip.titleKey, `Rule ${idx + 1}`)}
              </Text>
              {isDone && <Text style={styles.checkPill}>✅</Text>}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Safety Card */}
      <View style={[styles.card, {borderColor: current.color}]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.ruleBadge, {color: current.color}]}>
            🛡️ Safety Rule {selectedIdx + 1} of {SAFETY_TIPS_LIST.length}
          </Text>
          <Text style={styles.counter}>
            {reviewedIds.length}/{SAFETY_TIPS_LIST.length} Learned
          </Text>
        </View>

        <View
          style={[styles.emojiStage, {backgroundColor: `${current.color}15`}]}>
          <Text style={styles.bigEmoji}>{current.emoji}</Text>
        </View>

        <Text style={[styles.title, {color: current.color}]}>
          {t(current.titleKey, current.id)}
        </Text>

        <View style={styles.ruleBox}>
          <Text style={styles.ruleLabel}>📌 The Golden Safety Rule:</Text>
          <Text style={styles.ruleText}>{t(current.ruleKey, '')}</Text>
        </View>

        <View style={styles.choiceBox}>
          <Text style={styles.choiceLabel}>🛡️ Safe Super-Choice:</Text>
          <Text style={styles.choiceText}>{t(current.safeChoiceKey, '')}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => handleSelectTip(selectedIdx)}
          style={[styles.actionBtn, {backgroundColor: current.color}]}>
          <Text style={styles.actionBtnText}>
            {reviewedIds.includes(current.id)
              ? '✨ I Know This Safety Rule!'
              : 'Tap to Complete Rule!'}
          </Text>
        </Pressable>
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
  strip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  pillEmoji: {
    fontSize: 18,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  checkPill: {
    fontSize: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleBadge: {
    fontSize: 12,
    fontWeight: '900',
  },
  counter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  emojiStage: {
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  ruleBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    gap: 4,
  },
  ruleLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#991B1B',
  },
  ruleText: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  choiceBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  choiceLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#166534',
  },
  choiceText: {
    fontSize: 13,
    color: '#14532D',
    lineHeight: 18,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
