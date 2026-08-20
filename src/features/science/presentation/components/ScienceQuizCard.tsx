import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {ScienceQuizQuestion} from '../../domain/catalog/scienceData';

type ScienceQuizCardProps = {
  readonly question: ScienceQuizQuestion;
  readonly selectedOptionId: string | null;
  readonly onSelectOption: (optionId: string, isCorrect: boolean) => void;
  readonly showExplanation: boolean;
};

export function ScienceQuizCard({
  question,
  selectedOptionId,
  onSelectOption,
  showExplanation,
}: ScienceQuizCardProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.questionText}>{t(question.questionKey, '')}</Text>

      <View style={styles.optionsWrap}>
        {question.options.map(opt => {
          const isSelected = selectedOptionId === opt.id;
          let optStyle = styles.optionBtn;
          if (showExplanation) {
            if (opt.isCorrect) {
              optStyle = [styles.optionBtn, styles.correctOption];
            } else if (isSelected && !opt.isCorrect) {
              optStyle = [styles.optionBtn, styles.wrongOption];
            }
          } else if (isSelected) {
            optStyle = [styles.optionBtn, styles.selectedOption];
          }

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              disabled={showExplanation}
              onPress={() => onSelectOption(opt.id, opt.isCorrect)}
              style={optStyle}>
              <Text style={styles.optEmoji}>{opt.emoji}</Text>
              <Text style={styles.optText}>{t(opt.textKey, '')}</Text>
            </Pressable>
          );
        })}
      </View>

      {showExplanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationText}>
            💡 {t(question.explanationKey, '')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FDF2F8',
    shadowColor: '#EC4899',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    gap: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#831843',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsWrap: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FCE7F3',
    gap: 12,
  },
  selectedOption: {
    borderColor: '#EC4899',
    backgroundColor: '#FCE7F3',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  wrongOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optEmoji: {
    fontSize: 28,
  },
  optText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#831843',
    flex: 1,
  },
  explanationBox: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  explanationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'center',
  },
});
