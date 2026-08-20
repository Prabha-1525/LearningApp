import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {DAYS_OF_WEEK} from '../../domain/catalog/timeData';
import type {DayOfWeekInfo} from '../../domain/entities/timeEntities';

type DaysSequenceGameProps = {
  readonly onComplete?: (stars: number) => void;
};

const SEQUENCE_QUESTIONS = [
  {
    prompt: 'What day comes after Tuesday?',
    dayBefore: 'Tuesday',
    correctDayId: 'wednesday',
    options: ['monday', 'wednesday', 'thursday', 'friday'],
  },
  {
    prompt: 'What day comes after Friday?',
    dayBefore: 'Friday',
    correctDayId: 'saturday',
    options: ['thursday', 'saturday', 'sunday', 'monday'],
  },
  {
    prompt: 'What is the first day of the school week?',
    dayBefore: 'Sunday',
    correctDayId: 'monday',
    options: ['monday', 'tuesday', 'wednesday', 'thursday'],
  },
  {
    prompt: 'What day comes right before Sunday?',
    dayBefore: 'Sunday',
    correctDayId: 'saturday',
    options: ['friday', 'saturday', 'monday', 'thursday'],
  },
  {
    prompt: 'What day comes after Thursday?',
    dayBefore: 'Thursday',
    correctDayId: 'friday',
    options: ['wednesday', 'friday', 'saturday', 'sunday'],
  },
] as const;

export function DaysSequenceGame({onComplete}: DaysSequenceGameProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'learn' | 'sequence' | 'scenario'>(
    'learn',
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // Wednesday default

  // Sequence game state
  const [currentSeqQuestion, setCurrentSeqQuestion] = useState<number>(0);
  const [seqScore, setSeqScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  const handleSequenceAnswer = useCallback(
    (optionDayId: string) => {
      const currentQ = SEQUENCE_QUESTIONS[currentSeqQuestion];
      if (!currentQ) {
        return;
      }
      const isCorrect = optionDayId === currentQ.correctDayId;

      if (isCorrect) {
        setSeqScore(prev => prev + 1);
        setFeedback({
          correct: true,
          text: t('time.days.correctFeedback', 'Super! You got it right! 🎉'),
        });
      } else {
        const correctDay = DAYS_OF_WEEK.find(
          d => d.id === currentQ.correctDayId,
        );
        const correctName = correctDay
          ? t(correctDay.nameKey, correctDay.id)
          : currentQ.correctDayId;
        setFeedback({
          correct: false,
          text: t(
            'time.days.wrongFeedback',
            'Almost! The correct answer is {{day}}',
            {day: correctName},
          ),
        });
      }

      setTimeout(() => {
        setFeedback(null);
        if (currentSeqQuestion + 1 < SEQUENCE_QUESTIONS.length) {
          setCurrentSeqQuestion(prev => prev + 1);
        } else {
          onComplete?.(3);
        }
      }, 1500);
    },
    [currentSeqQuestion, t, onComplete],
  );

  // Scenario day calculations: 0=Sun, 1=Mon, ..., 6=Sat
  // DAYS_OF_WEEK is Monday (1) to Sunday (0)
  const currentDay = DAYS_OF_WEEK[selectedDayIndex] ?? DAYS_OF_WEEK[0]!;
  const yesterdayIndex = (selectedDayIndex - 1 + 7) % 7;
  const tomorrowIndex = (selectedDayIndex + 1) % 7;
  const yesterdayDay = DAYS_OF_WEEK[yesterdayIndex] ?? DAYS_OF_WEEK[0]!;
  const tomorrowDay = DAYS_OF_WEEK[tomorrowIndex] ?? DAYS_OF_WEEK[0]!;

  return (
    <View style={styles.container}>
      {/* Mode Switcher Tabs */}
      <View style={styles.tabSwitcher}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('learn')}
          style={[styles.tabBtn, activeTab === 'learn' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'learn' && styles.tabBtnTextActive,
            ]}>
            📅 {t('time.days.tabLearn', '7 Days')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('scenario')}
          style={[
            styles.tabBtn,
            activeTab === 'scenario' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'scenario' && styles.tabBtnTextActive,
            ]}>
            ⏮️ {t('time.days.tabScenario', 'Today & Tomorrow')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('sequence')}
          style={[
            styles.tabBtn,
            activeTab === 'sequence' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'sequence' && styles.tabBtnTextActive,
            ]}>
            🎮 {t('time.days.tabGame', 'Day Game')}
          </Text>
        </Pressable>
      </View>

      {/* Tab 1: Learn the 7 Days */}
      {activeTab === 'learn' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.daysScroll}>
          <Text style={styles.sectionHeader}>
            {t('time.days.learnTitle', 'Days of the Week in Order')}
          </Text>
          <Text style={styles.sectionSub}>
            {t('time.days.learnSub', 'There are 7 days in every single week!')}
          </Text>

          <View style={styles.daysList}>
            {DAYS_OF_WEEK.map((day: DayOfWeekInfo, index: number) => (
              <View
                key={day.id}
                style={[styles.dayCard, {borderColor: day.color}]}>
                <View
                  style={[
                    styles.dayNumberCircle,
                    {backgroundColor: day.color},
                  ]}>
                  <Text style={styles.dayNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.dayIcon}>{day.icon}</Text>
                <View style={styles.dayMeta}>
                  <Text style={[styles.dayName, {color: day.color}]}>
                    {t(day.nameKey, day.id)}
                  </Text>
                  <Text style={styles.dayActivity}>
                    {t(day.activityKey, '')}
                  </Text>
                </View>
                {index < 5 ? (
                  <View style={styles.weekdayTag}>
                    <Text style={styles.weekdayTagText}>School Day</Text>
                  </View>
                ) : (
                  <View style={styles.weekendTag}>
                    <Text style={styles.weekendTagText}>Weekend 🎉</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tab 2: Yesterday, Today, Tomorrow Simulator */}
      {activeTab === 'scenario' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scenarioScroll}>
          <Text style={styles.sectionHeader}>
            {t('time.days.scenarioTitle', 'Yesterday, Today, & Tomorrow')}
          </Text>
          <Text style={styles.sectionSub}>
            {t(
              'time.days.scenarioSub',
              'Tap any day below to make it "Today"!',
            )}
          </Text>

          {/* Day Picker Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pickerRow}>
            {DAYS_OF_WEEK.map((day: DayOfWeekInfo, idx: number) => {
              const isSelected = idx === selectedDayIndex;
              return (
                <Pressable
                  key={day.id}
                  accessibilityRole="button"
                  onPress={() => setSelectedDayIndex(idx)}
                  style={[
                    styles.pickerPill,
                    isSelected && {
                      backgroundColor: day.color,
                      borderColor: day.color,
                    },
                  ]}>
                  <Text style={styles.pickerPillIcon}>{day.icon}</Text>
                  <Text
                    style={[
                      styles.pickerPillText,
                      isSelected && styles.pickerPillTextSelected,
                    ]}>
                    {t(day.nameKey, day.id)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 3 Scenario Cards Display */}
          <View style={styles.storyCardGrid}>
            {/* Yesterday */}
            <View style={[styles.storyCard, styles.storyCardYesterday]}>
              <Text style={styles.storyCardBadge}>⏮️ Yesterday</Text>
              <Text style={styles.storyCardIcon}>{yesterdayDay.icon}</Text>
              <Text style={styles.storyCardDayName}>
                {t(yesterdayDay.nameKey, yesterdayDay.id)}
              </Text>
              <Text style={styles.storyCardSub}>The day before</Text>
            </View>

            {/* Today */}
            <View
              style={[
                styles.storyCard,
                styles.storyCardToday,
                {borderColor: currentDay.color},
              ]}>
              <View
                style={[
                  styles.todayBannerPill,
                  {backgroundColor: currentDay.color},
                ]}>
                <Text style={styles.todayBannerText}>📍 TODAY</Text>
              </View>
              <Text style={styles.storyCardIcon}>{currentDay.icon}</Text>
              <Text
                style={[styles.storyCardDayName, {color: currentDay.color}]}>
                {t(currentDay.nameKey, currentDay.id)}
              </Text>
              <Text style={styles.storyCardSub}>This present day</Text>
            </View>

            {/* Tomorrow */}
            <View style={[styles.storyCard, styles.storyCardTomorrow]}>
              <Text style={styles.storyCardBadge}>⏭️ Tomorrow</Text>
              <Text style={styles.storyCardIcon}>{tomorrowDay.icon}</Text>
              <Text style={styles.storyCardDayName}>
                {t(tomorrowDay.nameKey, tomorrowDay.id)}
              </Text>
              <Text style={styles.storyCardSub}>The next day</Text>
            </View>
          </View>

          {/* Explanation Box */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              📖 {t('time.days.storySentence', 'Story Time')}
            </Text>
            <Text style={styles.explanationText}>
              "Today is{' '}
              <Text style={[styles.boldText, {color: currentDay.color}]}>
                {t(currentDay.nameKey, currentDay.id)}
              </Text>
              ! Yesterday was{' '}
              <Text style={[styles.boldText, styles.yesterdayTextColor]}>
                {t(yesterdayDay.nameKey, yesterdayDay.id)}
              </Text>
              , and tomorrow will be{' '}
              <Text style={[styles.boldText, styles.tomorrowTextColor]}>
                {t(tomorrowDay.nameKey, tomorrowDay.id)}
              </Text>
              !"
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Tab 3: Sequence Quiz Game */}
      {activeTab === 'sequence' && (
        <View style={styles.gameContainer}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameProgress}>
              Question {currentSeqQuestion + 1} / {SEQUENCE_QUESTIONS.length}
            </Text>
            <Text style={styles.gameScore}>⭐ Score: {seqScore}</Text>
          </View>

          <View style={styles.quizCard}>
            <Text style={styles.quizPrompt}>
              {SEQUENCE_QUESTIONS[currentSeqQuestion]?.prompt}
            </Text>

            {/* Options grid */}
            <View style={styles.optionsGrid}>
              {SEQUENCE_QUESTIONS[currentSeqQuestion]?.options.map(
                (dayId: string) => {
                  const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
                  const isSelected = feedback !== null;
                  const isCorrectAnswer =
                    dayId ===
                    SEQUENCE_QUESTIONS[currentSeqQuestion]?.correctDayId;

                  let btnStyle = styles.optionBtn;
                  if (isSelected && isCorrectAnswer) {
                    btnStyle = styles.optionBtnCorrect;
                  } else if (isSelected && !isCorrectAnswer) {
                    btnStyle = styles.optionBtnDisabled;
                  }

                  return (
                    <Pressable
                      key={dayId}
                      accessibilityRole="button"
                      disabled={feedback !== null}
                      onPress={() => handleSequenceAnswer(dayId)}
                      style={btnStyle}>
                      <Text style={styles.optionEmoji}>{dayObj?.icon}</Text>
                      <Text style={styles.optionText}>
                        {dayObj ? t(dayObj.nameKey, dayId) : dayId}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#1E293B',
    fontWeight: '900',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  sectionSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  daysScroll: {
    paddingBottom: 24,
  },
  daysList: {
    gap: 10,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dayIcon: {
    fontSize: 24,
  },
  dayMeta: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '900',
  },
  dayActivity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  weekdayTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weekendTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tagTextWeekend: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  scenarioContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  dayRibbon: {
    gap: 8,
    paddingVertical: 4,
  },
  ribbonItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  ribbonIcon: {
    fontSize: 18,
  },
  ribbonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  ribbonTextSelected: {
    color: '#FFFFFF',
  },
  storyCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  storyCard: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    gap: 4,
  },
  storyCardYesterday: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  storyCardToday: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    transform: [{scale: 1.04}],
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  storyCardTomorrow: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  storyCardBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  storyCardBadgeToday: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563EB',
  },
  storyCardIcon: {
    fontSize: 24,
  },
  storyCardDayName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  storyCardDayNameToday: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1D4ED8',
    textAlign: 'center',
  },
  storyCardSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  storyCardSubToday: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
  },
  explanationBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
    marginTop: 6,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  boldText: {
    fontWeight: '900',
  },
  yesterdayTextColor: {
    color: '#64748B',
  },
  tomorrowTextColor: {
    color: '#10B981',
  },
  weekdayTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  weekendTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  pickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pickerPillIcon: {
    fontSize: 16,
  },
  pickerPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  pickerPillTextSelected: {
    color: '#FFFFFF',
  },
  storyCardGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  todayBannerPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayBannerText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gameContainer: {
    gap: 14,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  gameProgress: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  gameScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  quizPrompt: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  optionBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionBtnDisabled: {
    opacity: 0.5,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
});
