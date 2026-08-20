import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MONTHS_OF_YEAR} from '../../domain/catalog/timeData';

type InteractiveCalendarViewProps = {
  readonly onDateTap?: (day: number, monthName: string) => void;
  readonly onGameComplete?: (stars: number) => void;
};

const DAY_LETTERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function InteractiveCalendarView({
  onDateTap,
  onGameComplete,
}: InteractiveCalendarViewProps) {
  const {t} = useTranslation();
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedDate, setSelectedDate] = useState<number | null>(
    new Date().getDate(),
  );

  // Mini-game state
  const [gameTargetDate, setGameTargetDate] = useState<number | null>(15);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState<number>(0);

  const monthData = MONTHS_OF_YEAR[currentMonthIndex];

  // Compute first day of month (0=Sun, 1=Mon, ...)
  const firstDayWeekday = useMemo(() => {
    return new Date(currentYear, currentMonthIndex, 1).getDay();
  }, [currentYear, currentMonthIndex]);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
    setSelectedDate(null);
  };

  const handleCellTap = useCallback(
    (day: number) => {
      setSelectedDate(day);
      onDateTap?.(day, t(monthData.nameKey, monthData.id));

      if (gameTargetDate !== null) {
        if (day === gameTargetDate) {
          const nextScore = gameScore + 1;
          setGameScore(nextScore);
          setGameFeedback(
            `🎉 You found the ${day}th of ${t(monthData.nameKey)}!`,
          );
          const nextTarget = Math.floor(Math.random() * (daysInMonth - 1)) + 1;
          setGameTargetDate(nextTarget);
          if (nextScore >= 3) {
            onGameComplete?.(3);
          }
        } else {
          setGameFeedback(
            `💡 That is day ${day}. Look for day ${gameTargetDate}!`,
          );
        }
        setTimeout(() => setGameFeedback(null), 1500);
      }
    },
    [
      monthData,
      gameTargetDate,
      gameScore,
      daysInMonth,
      t,
      onDateTap,
      onGameComplete,
    ],
  );

  const today = new Date();
  const isThisMonth =
    today.getMonth() === currentMonthIndex &&
    today.getFullYear() === currentYear;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Calendar Header Card */}
      <View style={styles.calendarCard}>
        {/* Month Navigator Header */}
        <View style={styles.monthNavRow}>
          <Pressable
            accessibilityRole="button"
            onPress={handlePrevMonth}
            style={styles.navArrowBtn}>
            <Text style={styles.navArrowText}>◀</Text>
          </Pressable>

          <View style={styles.monthTitleWrap}>
            <Text style={styles.monthNameText}>
              {monthData.icon} {t(monthData.nameKey, monthData.id)}
            </Text>
            <Text style={styles.yearText}>{currentYear}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleNextMonth}
            style={styles.navArrowBtn}>
            <Text style={styles.navArrowText}>▶</Text>
          </Pressable>
        </View>

        {/* Days of week header */}
        <View style={styles.weekHeaderRow}>
          {DAY_LETTERS.map((d, i) => (
            <View key={d} style={styles.weekHeaderCell}>
              <Text
                style={[
                  styles.weekHeaderText,
                  (i === 0 || i === 6) && styles.weekHeaderWeekend,
                ]}>
                {d}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid Cells */}
        <View style={styles.daysGrid}>
          {/* Empty cells before month start */}
          {Array.from({length: firstDayWeekday}).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCellEmpty} />
          ))}

          {/* Actual days 1 to daysInMonth */}
          {Array.from({length: daysInMonth}).map((_, i) => {
            const dayNum = i + 1;
            const isToday = isThisMonth && today.getDate() === dayNum;
            const isSelected = selectedDate === dayNum;
            const isGameTarget = gameTargetDate === dayNum;
            const dayOfWeek = (firstDayWeekday + i) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <Pressable
                key={dayNum}
                accessibilityRole="button"
                onPress={() => handleCellTap(dayNum)}
                style={[
                  styles.dayCell,
                  isToday && styles.dayCellToday,
                  isSelected && styles.dayCellSelected,
                  isGameTarget && styles.dayCellTarget,
                ]}>
                <Text
                  style={[
                    styles.dayCellNumber,
                    isWeekend && styles.dayCellWeekend,
                    isToday && styles.dayCellTodayText,
                    isSelected && styles.dayCellSelectedText,
                  ]}>
                  {dayNum}
                </Text>
                {isToday && <View style={styles.todayDot} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Mini-Game / Target Finder */}
      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameTitle}>🎯 Calendar Finder Game</Text>
          <Text style={styles.gameScore}>⭐ Score: {gameScore}</Text>
        </View>
        <Text style={styles.gamePrompt}>
          Can you find and tap on{' '}
          <Text style={styles.gameTargetHighlight}>
            {t(monthData.nameKey)} {gameTargetDate}
          </Text>
          ?
        </Text>
        {gameFeedback && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{gameFeedback}</Text>
          </View>
        )}
      </View>

      {/* Selected Date Inspector */}
      {selectedDate !== null && (
        <View style={styles.inspectorCard}>
          <Text style={styles.inspectorTitle}>
            🗓️ Selected Date: {t(monthData.nameKey)} {selectedDate},{' '}
            {currentYear}
          </Text>
          <Text style={styles.inspectorSub}>
            Total days in this month:{' '}
            <Text style={styles.daysCountHighlight}>{daysInMonth} days</Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#06B6D4',
    shadowColor: '#06B6D4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFEFF',
    borderWidth: 1.5,
    borderColor: '#A5F3FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0891B2',
  },
  monthTitleWrap: {
    alignItems: 'center',
  },
  monthNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  yearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  weekHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 6,
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  weekHeaderWeekend: {
    color: '#EF4444',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellEmpty: {
    width: '14.28%',
    height: 42,
  },
  dayCell: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  dayCellToday: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  dayCellSelected: {
    backgroundColor: '#06B6D4',
  },
  dayCellTarget: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  dayCellNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  dayCellWeekend: {
    color: '#DC2626',
  },
  dayCellTodayText: {
    color: '#B45309',
    fontWeight: '900',
  },
  dayCellSelectedText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  todayDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  gameCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    gap: 8,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
  },
  gameScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  gamePrompt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#134E4A',
  },
  feedbackBanner: {
    backgroundColor: '#CCFBF1',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#115E59',
  },
  inspectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  inspectorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  inspectorSub: {
    fontSize: 13,
    color: '#475569',
  },
  gameTargetHighlight: {
    fontWeight: '900',
    color: '#0284C7',
  },
  daysCountHighlight: {
    fontWeight: '900',
    color: '#3B82F6',
  },
});
