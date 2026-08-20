import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {TimeQuizQuestion} from '../../domain/entities/timeEntities';
import {InteractiveClock} from './InteractiveClock';

type TimeQuizCardProps = {
  readonly question: TimeQuizQuestion;
  readonly onAnswer: (isCorrect: boolean) => void;
};

export function TimeQuizCard({question, onAnswer}: TimeQuizCardProps) {
  const {t} = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) {
      return;
    }
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    onAnswer(isCorrect);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.questionText}>
        {t(
          question.questionKey,
          question.promptText ?? 'Select the correct answer:',
        )}
      </Text>

      {/* Clock illustration if question involves reading a clock */}
      {question.clockHour !== undefined &&
        question.clockMinute !== undefined && (
          <View style={styles.clockWrap}>
            <InteractiveClock
              hour={question.clockHour}
              minute={question.clockMinute}
              isInteractive={false}
              showDigitalTime={false}
              showDayPartTag={false}
              showControls={false}
              size={180}
            />
          </View>
        )}

      {/* Multiple Choice Options */}
      <View style={styles.optionsList}>
        {question.options.map(opt => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = styles.optionBtn;
          let textStyle = styles.optionText;

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = StyleSheet.compose(btnStyle, styles.optionBtnCorrect);
              textStyle = StyleSheet.compose(
                textStyle,
                styles.optionTextCorrect,
              );
            } else if (isSelected && !opt.isCorrect) {
              btnStyle = StyleSheet.compose(btnStyle, styles.optionBtnWrong);
              textStyle = StyleSheet.compose(textStyle, styles.optionTextWrong);
            }
          }

          const label = opt.labelKey ? t(opt.labelKey) : opt.text;

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              disabled={isAnswered}
              onPress={() => handleSelect(opt.id, opt.isCorrect)}
              style={({pressed}) => [
                btnStyle,
                pressed && !isAnswered && styles.optionBtnPressed,
              ]}>
              {opt.icon && <Text style={styles.optIcon}>{opt.icon}</Text>}
              <Text style={textStyle}>{label}</Text>
              {isAnswered && opt.isCorrect && (
                <Text style={styles.statusBadge}>✅</Text>
              )}
              {isAnswered && isSelected && !opt.isCorrect && (
                <Text style={styles.statusBadge}>❌</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Explanation reveal */}
      {isAnswered && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>💡 Explanation</Text>
          <Text style={styles.explanationBody}>
            {t(question.explanationKey, 'Great job learning time concepts!')}
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
    padding: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 14,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  clockWrap: {
    alignItems: 'center',
    marginVertical: 4,
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    gap: 10,
  },
  optionBtnPressed: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  optionBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optIcon: {
    fontSize: 22,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  optionTextCorrect: {
    color: '#047857',
  },
  optionTextWrong: {
    color: '#B91C1C',
  },
  statusBadge: {
    fontSize: 16,
  },
  explanationBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  explanationBody: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
});
