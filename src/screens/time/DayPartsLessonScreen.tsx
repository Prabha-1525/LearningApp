import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {DAY_PARTS} from '../../features/time/domain/catalog/timeData';
import type {DayPartInfo} from '../../features/time/domain/entities/timeEntities';
import {recordTimeTopicCompletion} from '../../features/time/data/progress/timeProgress';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'DayPartsLesson'>;

export function DayPartsLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const [selectedPart, setSelectedPart] = useState<DayPartInfo>(DAY_PARTS[0]!);
  const [exploredParts, setExploredParts] = useState<Set<string>>(
    new Set([DAY_PARTS[0]!.id]),
  );

  const handleSelect = (part: DayPartInfo) => {
    setSelectedPart(part);
    const nextSet = new Set(exploredParts).add(part.id);
    setExploredParts(nextSet);
    if (nextSet.size === DAY_PARTS.length) {
      recordTimeTopicCompletion('day-parts', 3);
    }
  };

  const handleFinish = () => {
    recordTimeTopicCompletion('day-parts', 3);
    navigation.navigate('TimeComplete', {
      starsEarned: 3,
      topicTitle: t('time.topics.dayParts.title', 'Parts of the Day'),
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <LearningHeader
        title={t('time.topics.dayParts.title', 'Parts of the Day')}
        subtitle="Morning, Afternoon, Evening & Night"
        emoji="🌅"
        accentColor="#D97706"
        titleColor="#D97706"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* 4 Part Pills */}
        <View style={styles.pillsRow}>
          {DAY_PARTS.map((part: DayPartInfo) => {
            const isSelected = part.id === selectedPart.id;
            return (
              <Pressable
                key={part.id}
                accessibilityRole="button"
                onPress={() => handleSelect(part)}
                style={[
                  styles.partPill,
                  isSelected && styles.partPillSelected,
                ]}>
                <Text style={styles.pillIcon}>{part.icon}</Text>
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}>
                  {t(part.nameKey, part.id)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Selected Part Spotlight Card */}
        <View
          style={[
            styles.stageCard,
            {backgroundColor: selectedPart.skyGradient[0]},
          ]}>
          <View style={styles.stageHeader}>
            <Text style={styles.stageIcon}>{selectedPart.icon}</Text>
            <View style={styles.stageMeta}>
              <Text style={styles.stageTitle}>
                {t(selectedPart.nameKey, selectedPart.id)}
              </Text>
              <Text style={styles.stageTimeRange}>
                ⏰ {selectedPart.timeRange}
              </Text>
            </View>
          </View>
          <Text style={styles.stageDesc}>
            {t(selectedPart.descriptionKey, '')}
          </Text>
        </View>

        {/* Daily Activities Checklist */}
        <Text style={styles.sectionHeader}>
          {t('time.dayParts.activitiesTitle', 'What do we do in the')}{' '}
          {t(selectedPart.nameKey)}?
        </Text>
        <View style={styles.activitiesGrid}>
          {selectedPart.activities.map((act, index) => (
            <View key={index} style={styles.activityCard}>
              <Text style={styles.actIcon}>{act.icon}</Text>
              <Text style={styles.actTitle}>
                {t(act.titleKey, `Activity ${index + 1}`)}
              </Text>
            </View>
          ))}
        </View>

        {/* 24-Hour Cycle Info Banner */}
        <View style={styles.cycleCard}>
          <Text style={styles.cycleTitle}>🔄 The 24-Hour Day Cycle</Text>
          <Text style={styles.cycleText}>
            Every single day has 24 hours! The sun rises in the morning 🌅,
            shines bright in the afternoon ☀️, sets in the evening 🌆, and gives
            way to stars at night 🌙.
          </Text>
        </View>

        {/* Finish button */}
        {exploredParts.size >= 4 && (
          <Pressable
            accessibilityRole="button"
            onPress={handleFinish}
            style={styles.finishBtn}>
            <Text style={styles.finishBtnText}>
              Complete & Collect Stars ⭐
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  partPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FDE68A',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  partPillSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  pillIcon: {
    fontSize: 20,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350F',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  stageCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: '#F59E0B',
    gap: 10,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stageIcon: {
    fontSize: 44,
  },
  stageMeta: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
  },
  stageTimeRange: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 2,
  },
  stageDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1E293B',
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actIcon: {
    fontSize: 32,
  },
  actTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  cycleCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    gap: 6,
  },
  cycleTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
  },
  cycleText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  finishBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  finishBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
