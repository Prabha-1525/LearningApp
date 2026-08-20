import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MONTHS_OF_YEAR} from '../../domain/catalog/timeData';
import type {MonthInfo} from '../../domain/entities/timeEntities';

const MISSING_PUZZLES = [
  {
    before: MONTHS_OF_YEAR[0] ?? ({} as MonthInfo), // Jan
    after: MONTHS_OF_YEAR[2] ?? ({} as MonthInfo), // Mar
    missingMonth: MONTHS_OF_YEAR[1] ?? ({} as MonthInfo), // Feb
    options: [
      MONTHS_OF_YEAR[1] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[4] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[7] ?? ({} as MonthInfo),
    ],
  },
  {
    before: MONTHS_OF_YEAR[3] ?? ({} as MonthInfo), // Apr
    after: MONTHS_OF_YEAR[5] ?? ({} as MonthInfo), // Jun
    missingMonth: MONTHS_OF_YEAR[4] ?? ({} as MonthInfo), // May
    options: [
      MONTHS_OF_YEAR[2] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[4] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[8] ?? ({} as MonthInfo),
    ],
  },
  {
    before: MONTHS_OF_YEAR[6] ?? ({} as MonthInfo), // Jul
    after: MONTHS_OF_YEAR[8] ?? ({} as MonthInfo), // Sep
    missingMonth: MONTHS_OF_YEAR[7] ?? ({} as MonthInfo), // Aug
    options: [
      MONTHS_OF_YEAR[5] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[7] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[10] ?? ({} as MonthInfo),
    ],
  },
  {
    before: MONTHS_OF_YEAR[9] ?? ({} as MonthInfo), // Oct
    after: MONTHS_OF_YEAR[11] ?? ({} as MonthInfo), // Dec
    missingMonth: MONTHS_OF_YEAR[10] ?? ({} as MonthInfo), // Nov
    options: [
      MONTHS_OF_YEAR[10] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[8] ?? ({} as MonthInfo),
      MONTHS_OF_YEAR[1] ?? ({} as MonthInfo),
    ],
  },
] as const;

type MonthsExplorerProps = {
  readonly onComplete?: (stars: number) => void;
};

export function MonthsExplorer({onComplete}: MonthsExplorerProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<
    'explore' | 'orderGame' | 'missingGame'
  >('explore');
  const [selectedMonth, setSelectedMonth] = useState<MonthInfo>(
    MONTHS_OF_YEAR[0] ?? ({} as MonthInfo),
  );

  // Order Game state
  const [orderStep, setOrderStep] = useState<number>(0); // Target month index 0..11
  const [orderShuffled] = useState<readonly MonthInfo[]>(() =>
    [...MONTHS_OF_YEAR].sort(() => Math.random() - 0.5),
  );
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Missing Month Game state
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const [missingScore, setMissingScore] = useState<number>(0);
  const [missingFeedback, setMissingFeedback] = useState<{
    correct: boolean;
    msg: string;
  } | null>(null);

  const handleOrderTap = useCallback(
    (month: MonthInfo) => {
      const targetMonth = MONTHS_OF_YEAR[orderStep];
      if (!targetMonth) {
        return;
      }
      if (month.id === targetMonth.id) {
        setOrderFeedback(
          `🎉 Yes! Month ${orderStep + 1} is ${t(month.nameKey, month.id)}`,
        );
        if (orderStep + 1 < MONTHS_OF_YEAR.length) {
          setOrderStep(prev => prev + 1);
        } else {
          setOrderFeedback('🏆 Amazing! You ordered all 12 months!');
          onComplete?.(3);
        }
      } else {
        setOrderFeedback(
          `💡 Not quite. We are looking for month #${orderStep + 1} (${t(
            targetMonth.nameKey,
            targetMonth.id,
          )})`,
        );
      }
    },
    [orderStep, t, onComplete],
  );

  const handleMissingTap = useCallback(
    (chosenMonth: MonthInfo) => {
      const currentPuzzle = MISSING_PUZZLES[missingIndex];
      if (!currentPuzzle) {
        return;
      }
      const isCorrect = chosenMonth.id === currentPuzzle.missingMonth.id;

      if (isCorrect) {
        setMissingScore(prev => prev + 1);
        setMissingFeedback({
          correct: true,
          msg: `🎉 Correct! ${t(
            chosenMonth.nameKey,
            chosenMonth.id,
          )} comes between ${t(currentPuzzle.before.nameKey)} & ${t(
            currentPuzzle.after.nameKey,
          )}!`,
        });
      } else {
        setMissingFeedback({
          correct: false,
          msg: `💡 Almost! The month between ${t(
            currentPuzzle.before.nameKey,
          )} & ${t(currentPuzzle.after.nameKey)} is ${t(
            currentPuzzle.missingMonth.nameKey,
          )}.`,
        });
      }

      setTimeout(() => {
        setMissingFeedback(null);
        if (missingIndex + 1 < MISSING_PUZZLES.length) {
          setMissingIndex(prev => prev + 1);
        } else {
          onComplete?.(3);
        }
      }, 1600);
    },
    [missingIndex, t, onComplete],
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('explore')}
          style={[
            styles.tabBtn,
            activeTab === 'explore' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'explore' && styles.tabBtnTextActive,
            ]}>
            📆 {t('time.months.tabExplore', '12 Months')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('orderGame')}
          style={[
            styles.tabBtn,
            activeTab === 'orderGame' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'orderGame' && styles.tabBtnTextActive,
            ]}>
            🔢 {t('time.months.tabOrder', 'Order Game')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('missingGame')}
          style={[
            styles.tabBtn,
            activeTab === 'missingGame' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'missingGame' && styles.tabBtnTextActive,
            ]}>
            ❓ {t('time.months.tabMissing', 'Missing Month')}
          </Text>
        </Pressable>
      </View>

      {/* Tab 1: Explore Months Grid */}
      {activeTab === 'explore' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.exploreContainer}>
          {/* Spotlight Card */}
          <View
            style={[styles.spotlightCard, {borderColor: selectedMonth.color}]}>
            <View style={styles.spotlightHeader}>
              <View
                style={[
                  styles.spotlightCircle,
                  {backgroundColor: `${selectedMonth.color}25`},
                ]}>
                <Text style={styles.spotlightIcon}>{selectedMonth.icon}</Text>
              </View>
              <View style={styles.spotlightMeta}>
                <Text style={styles.spotlightNum}>
                  Month {selectedMonth.monthIndex + 1} of 12
                </Text>
                <Text
                  style={[styles.spotlightTitle, {color: selectedMonth.color}]}>
                  {t(selectedMonth.nameKey, selectedMonth.id)}
                </Text>
              </View>
              <View style={styles.daysBadge}>
                <Text style={styles.daysBadgeNum}>
                  {selectedMonth.daysCount}
                </Text>
                <Text style={styles.daysBadgeLabel}>DAYS</Text>
              </View>
            </View>
            <Text style={styles.spotlightHighlight}>
              ✨ {t(selectedMonth.highlightKey, 'Special time of year!')}
            </Text>
          </View>

          {/* Month Rhyme / Rule Guide */}
          <View style={styles.rhymeBox}>
            <Text style={styles.rhymeTitle}>💡 Memory Rhyme</Text>
            <Text style={styles.rhymeText}>
              "30 days has September, April, June, and November.{'\n'}
              All the rest have 31, except February alone (28/29)!"
            </Text>
          </View>

          {/* 12 Months Grid */}
          <Text style={styles.gridSectionTitle}>
            {t('time.months.allMonths', 'Tap any month to explore:')}
          </Text>
          <View style={styles.monthsGrid}>
            {MONTHS_OF_YEAR.map((month: MonthInfo) => {
              const isSelected = month.id === selectedMonth.id;
              return (
                <Pressable
                  key={month.id}
                  accessibilityRole="button"
                  onPress={() => setSelectedMonth(month)}
                  style={[
                    styles.monthGridCard,
                    {borderColor: month.color},
                    isSelected && [
                      styles.monthGridCardSelected,
                      {backgroundColor: `${month.color}15`},
                    ],
                  ]}>
                  <Text style={styles.gridMonthIndex}>
                    #{month.monthIndex + 1}
                  </Text>
                  <Text style={styles.gridMonthIcon}>{month.icon}</Text>
                  <Text style={[styles.gridMonthName, {color: month.color}]}>
                    {t(month.shortNameKey, month.id.slice(0, 3))}
                  </Text>
                  <Text style={styles.gridDaysCount}>{month.daysCount}d</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Tab 2: Month Ordering Challenge */}
      {activeTab === 'orderGame' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.orderGameContainer}>
          <Text style={styles.sectionHeader}>
            {t('time.months.orderTitle', 'Tap the Months in Order!')}
          </Text>
          <Text style={styles.sectionSub}>
            Target: Month #{orderStep < 12 ? orderStep + 1 : 12} (
            {orderStep < 12
              ? t(MONTHS_OF_YEAR[orderStep]?.nameKey ?? '')
              : 'Complete!'}
            )
          </Text>

          {/* Progress sequence bar */}
          <View style={styles.orderSequenceBar}>
            {MONTHS_OF_YEAR.map((m, idx) => (
              <View
                key={m.id}
                style={[
                  styles.seqDot,
                  idx < orderStep
                    ? styles.seqDotDone
                    : idx === orderStep
                    ? styles.seqDotCurrent
                    : styles.seqDotPending,
                ]}>
                <Text style={styles.seqDotText}>{idx + 1}</Text>
              </View>
            ))}
          </View>

          {orderFeedback && (
            <View style={styles.orderFeedbackBox}>
              <Text style={styles.orderFeedbackText}>{orderFeedback}</Text>
            </View>
          )}

          {/* Shuffled month chips */}
          <View style={styles.chipsContainer}>
            {orderShuffled.map(m => {
              const isAlreadyPlaced = m.monthIndex < orderStep;
              return (
                <Pressable
                  key={m.id}
                  accessibilityRole="button"
                  disabled={isAlreadyPlaced}
                  onPress={() => handleOrderTap(m)}
                  style={[
                    styles.monthChip,
                    isAlreadyPlaced && styles.monthChipDone,
                  ]}>
                  <Text style={styles.chipEmoji}>{m.icon}</Text>
                  <Text
                    style={[
                      styles.chipText,
                      isAlreadyPlaced && styles.chipTextDone,
                    ]}>
                    {t(m.nameKey, m.id)}
                  </Text>
                  {isAlreadyPlaced && <Text style={styles.chipCheck}>✅</Text>}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Tab 3: Missing Month Puzzle */}
      {activeTab === 'missingGame' && (
        <View style={styles.missingContainer}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameProgress}>
              Puzzle {missingIndex + 1} / {MISSING_PUZZLES.length}
            </Text>
            <Text style={styles.gameScore}>⭐ Score: {missingScore}</Text>
          </View>

          {/* Puzzle visual trio */}
          <View style={styles.trioRow}>
            {/* Before */}
            <View style={styles.trioCard}>
              <Text style={styles.trioIcon}>
                {MISSING_PUZZLES[missingIndex]?.before.icon}
              </Text>
              <Text style={styles.trioName}>
                {t(MISSING_PUZZLES[missingIndex]?.before.nameKey ?? '')}
              </Text>
            </View>

            <Text style={styles.trioArrow}>➔</Text>

            {/* Missing */}
            <View style={[styles.trioCard, styles.trioCardMissing]}>
              <Text style={styles.trioQuestionMark}>❓</Text>
              <Text style={styles.trioMissingLabel}>What's next?</Text>
            </View>

            <Text style={styles.trioArrow}>➔</Text>

            {/* After */}
            <View style={styles.trioCard}>
              <Text style={styles.trioIcon}>
                {MISSING_PUZZLES[missingIndex]?.after.icon}
              </Text>
              <Text style={styles.trioName}>
                {t(MISSING_PUZZLES[missingIndex]?.after.nameKey ?? '')}
              </Text>
            </View>
          </View>

          {missingFeedback && (
            <View
              style={[
                styles.feedbackBanner,
                missingFeedback.correct
                  ? styles.feedbackBannerSuccess
                  : styles.feedbackBannerError,
              ]}>
              <Text style={styles.feedbackText}>{missingFeedback.msg}</Text>
            </View>
          )}

          {/* Option choices */}
          <Text style={styles.optionsPrompt}>
            Which month fits in the blank?
          </Text>
          <View style={styles.missingOptionsList}>
            {MISSING_PUZZLES[missingIndex]?.options.map((opt: MonthInfo) => (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                onPress={() => handleMissingTap(opt)}
                style={({pressed}) => [
                  styles.missingOptionBtn,
                  pressed && styles.missingOptionBtnPressed,
                ]}>
                <Text style={styles.missingOptIcon}>{opt.icon}</Text>
                <Text style={styles.missingOptName}>
                  {t(opt.nameKey, opt.id)}
                </Text>
              </Pressable>
            ))}
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
  exploreContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  spotlightCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spotlightCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightIcon: {
    fontSize: 28,
  },
  spotlightMeta: {
    flex: 1,
  },
  spotlightNum: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  spotlightTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  daysBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  daysBadgeNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38BDF8',
  },
  daysBadgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  spotlightHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
  },
  rhymeBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    gap: 4,
  },
  rhymeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  rhymeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350F',
    lineHeight: 18,
  },
  gridSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginTop: 4,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthGridCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 2,
  },
  monthGridCardSelected: {
    borderWidth: 2.5,
  },
  gridMonthIndex: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  gridMonthIcon: {
    fontSize: 20,
  },
  gridMonthName: {
    fontSize: 13,
    fontWeight: '900',
  },
  gridDaysCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  orderGameContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  sectionSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  orderSequenceBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  seqDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqDotDone: {
    backgroundColor: '#10B981',
  },
  seqDotCurrent: {
    backgroundColor: '#3B82F6',
    transform: [{scale: 1.15}],
  },
  seqDotPending: {
    backgroundColor: '#E2E8F0',
  },
  seqDotText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  orderFeedbackBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
    alignItems: 'center',
  },
  orderFeedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  monthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  monthChipDone: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  chipTextDone: {
    color: '#94A3B8',
  },
  chipCheck: {
    fontSize: 12,
  },
  missingContainer: {
    gap: 14,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  trioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  trioCard: {
    width: 84,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 6,
    gap: 4,
  },
  trioCardMissing: {
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  trioIcon: {
    fontSize: 26,
  },
  trioName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  trioQuestionMark: {
    fontSize: 26,
  },
  trioMissingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  trioArrow: {
    fontSize: 16,
    color: '#94A3B8',
  },
  feedbackBanner: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  feedbackBannerSuccess: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  feedbackBannerError: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  optionsPrompt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  missingOptionsList: {
    gap: 8,
  },
  missingOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  missingOptionBtnPressed: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  missingOptIcon: {
    fontSize: 24,
  },
  missingOptName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
});
