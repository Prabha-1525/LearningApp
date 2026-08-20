import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {TIME_TOPICS} from '../../features/time/domain/catalog/timeData';
import {readTimeProgress} from '../../features/time/data/progress/timeProgress';
import type {TimeProgress} from '../../features/time/domain/entities/timeEntities';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'Home'>;

export function TimeHomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<TimeProgress>(readTimeProgress());

  useFocusEffect(
    useCallback(() => {
      setProgress(readTimeProgress());
    }, []),
  );

  const completedCount = Object.values(progress.topicsProgress).filter(
    tp => tp.completed,
  ).length;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0F9FF">
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🕐</Text>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>
            {t('time.home.title', 'Time & Calendar')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t('time.home.subtitle', 'Learn clocks, days, months & seasons!')}
          </Text>
        </View>
        <View style={styles.starPill}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starCount}>{progress.totalStars}</Text>
        </View>
      </View>

      {/* Progress Strip */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          {t('time.home.progress', {
            completed: completedCount,
            total: TIME_TOPICS.length,
            defaultValue: `${completedCount} / ${TIME_TOPICS.length} lessons completed`,
          })}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {width: `${(completedCount / TIME_TOPICS.length) * 100}%`},
            ]}
          />
        </View>
      </View>

      {/* Topics Grid */}
      <ScrollView
        contentContainerStyle={styles.topicsGrid}
        showsVerticalScrollIndicator={false}>
        {TIME_TOPICS.map(topic => {
          const topicProgress = progress.topicsProgress[topic.id];
          const isDone = topicProgress?.completed;
          const stars = topicProgress?.stars ?? 0;

          return (
            <Pressable
              key={topic.id}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate(
                  topic.targetScreen as keyof TimeStackParamList as any,
                )
              }
              style={({pressed}) => [
                styles.topicCard,
                {borderColor: topic.accentColor},
                pressed && styles.topicCardPressed,
              ]}>
              <View
                style={[
                  styles.iconCircle,
                  {backgroundColor: topic.bgLightColor},
                ]}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
              </View>

              <View style={styles.topicInfo}>
                <Text style={[styles.topicTitle, {color: topic.accentColor}]}>
                  {t(topic.titleKey, topic.id)}
                </Text>
                <Text style={styles.topicDesc} numberOfLines={2}>
                  {t(topic.descriptionKey, '')}
                </Text>
              </View>

              <View style={styles.rightPill}>
                {isDone ? (
                  <View style={styles.doneStars}>
                    <Text style={styles.doneStarsText}>
                      {'⭐'.repeat(stars || 3)}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.playPill,
                      {backgroundColor: topic.accentColor},
                    ]}>
                    <Text style={styles.playPillText}>
                      {t('common.play', 'PLAY')} ▶
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#0284C7',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerEmoji: {
    fontSize: 44,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0369A1',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 2,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  starIcon: {
    fontSize: 16,
  },
  starCount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BAE6FD',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 4,
  },
  topicsGrid: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topicCardPressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIcon: {
    fontSize: 30,
  },
  topicInfo: {
    flex: 1,
    gap: 2,
  },
  topicTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  topicDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  rightPill: {
    alignItems: 'flex-end',
  },
  playPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  playPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  doneStars: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  doneStarsText: {
    fontSize: 12,
  },
  bottomSpacer: {
    height: 32,
  },
});
